import { useEffect, useRef, useState, useCallback } from 'react';
import { apiRequest } from './api';

declare global {
  interface Window {
    google?: any;
    onGoogleLibraryLoad?: () => void;
  }
}

export interface GoogleSignInResult {
  user: any;
  token: string;
  isNewUser?: boolean;
}

export interface UseGoogleSignInOptions {
  /** Called when Google auth + backend exchange succeeds. You should save token and redirect. */
  onSuccess?: (result: GoogleSignInResult, rememberMe: boolean) => void | Promise<void>;
  /** Called when an error happens (Google popup denied, verification failure, etc.) */
  onError?: (message: string) => void;
  /** Your Google OAuth 2.0 Web Client ID from Google Cloud Console. */
  clientId?: string;
  /** Use a button rendered by Google ("standard" button) vs trigger a Google popup ("popup" mode). */
  mode?: 'button' | 'popup';
  /** Context to pass along to the onSuccess handler ("login" or "signup" etc). */
  context?: string;
}

const GIS_SDK_URL = 'https://accounts.google.com/gsi/client';
const DEFAULT_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  (import.meta as any).env?.VITE_PUBLIC_GOOGLE_CLIENT_ID ||
  '';

/**
 * Loads the Google Identity Services (GIS) SDK once and returns helpers to:
 *   1. Render a Google sign-in button into a DOM `ref` (button mode)
 *   2. Programmatically trigger a Google account chooser popup (popup mode)
 *
 * Once Google returns an id_token ("credential"), we post it to the backend
 * at POST /api/auth/google.  The backend verifies it with google-auth-library,
 * finds or creates the User, creates a FREE Subscription if needed, writes a
 * LOGIN_GOOGLE SecurityLog, and returns the same { user, token } shape as
 * email/password login.
 */
export const useGoogleSignIn = (options: UseGoogleSignInOptions = {}) => {
  const {
    onSuccess,
    onError,
    clientId = DEFAULT_CLIENT_ID,
    mode = 'button',
  } = options;

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isSdkReady, setIsSdkReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sdkInjectedRef = useRef<boolean>(false);
  const clientInitializedRef = useRef<boolean>(false);
  const rememberRef = useRef<boolean>(true);

  const rememberGoogleRemember = useCallback((val: boolean) => {
    rememberRef.current = val;
  }, []);

  const exchangeCredentialForSession = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      try {
        const data = (await apiRequest('/auth/google', {
          method: 'POST',
          body: JSON.stringify({ credential, clientId: clientId || undefined }),
        })) as GoogleSignInResult;
        if (onSuccess) {
          await onSuccess(data, rememberRef.current);
        }
      } catch (err: any) {
        if (onError) onError(err?.message || 'Google sign-in failed');
      } finally {
        setIsLoading(false);
      }
    },
    [clientId, onSuccess, onError]
  );

  const loadSdk = useCallback(() => {
    if (!clientId) {
      return;
    }
    if (typeof window === 'undefined') return;
    if (window.google?.accounts?.id) {
      setIsSdkReady(true);
      return;
    }
    if (sdkInjectedRef.current) return;
    sdkInjectedRef.current = true;

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => setIsSdkReady(true));
      return;
    }

    const s = document.createElement('script');
    s.src = GIS_SDK_URL;
    s.async = true;
    s.defer = true;
    s.onload = () => setIsSdkReady(true);
    s.onerror = () => {
      sdkInjectedRef.current = false;
      if (onError) onError('Failed to load Google sign-in SDK');
    };
    document.body.appendChild(s);
  }, [clientId, onError]);

  const initializeGoogleClient = useCallback(() => {
    if (!window.google?.accounts?.id) return;
    if (clientInitializedRef.current) return;
    if (!clientId) return;
    clientInitializedRef.current = true;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: (response: any) => {
          if (response?.credential) {
            exchangeCredentialForSession(response.credential);
          } else if (response?.error) {
            if (onError) onError(`Google error: ${response.error}`);
          }
        },
        error_callback: (err: any) => {
          if (onError) onError(`Google SDK error: ${err?.type || err?.message || 'unknown'}`);
        },
      });
    } catch (e: any) {
      clientInitializedRef.current = false;
      if (onError) onError(`Failed to initialize Google client: ${e?.message || e}`);
    }
  }, [clientId, exchangeCredentialForSession, onError]);

  const renderButton = useCallback(() => {
    if (!buttonRef.current) return;
    if (!clientId) {
      buttonRef.current.innerHTML =
        '<div class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">' +
        'VITE_GOOGLE_CLIENT_ID is not configured. Set it in frontend/.env and restart Vite.' +
        '</div>';
      return;
    }
    if (!window.google?.accounts?.id) return;
    try {
      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: mode === 'popup' ? 'standard' : 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'popup' ? 'continue_with' : 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 240,
        locale: 'en',
      });
    } catch (e: any) {
      if (onError) onError(`Failed to render Google button: ${e?.message || e}`);
    }
  }, [clientId, mode, onError]);

  const triggerPopup = useCallback(async () => {
    if (!clientId) {
      if (onError) onError('VITE_GOOGLE_CLIENT_ID is not configured on the frontend');
      return;
    }
    if (!window.google?.accounts?.id) {
      if (onError) onError('Google sign-in SDK is not ready yet — please try again');
      return;
    }
    initializeGoogleClient();
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed() && onError) {
          onError(
            'Google sign-in popup was blocked by your browser. ' +
              'Please allow popups for this site or use the Google button directly.'
          );
        }
      });
    } catch (e: any) {
      if (onError) onError(`Google popup failed: ${e?.message || e}`);
    }
  }, [clientId, initializeGoogleClient, onError]);

  useEffect(() => {
    loadSdk();
  }, [loadSdk]);

  useEffect(() => {
    if (!isSdkReady) return;
    initializeGoogleClient();
    if (mode === 'button' && buttonRef.current) {
      renderButton();
    }
  }, [isSdkReady, mode, initializeGoogleClient, renderButton]);

  return {
    buttonRef,
    isSdkReady,
    isConfigured: Boolean(clientId),
    isLoading,
    triggerPopup,
    rememberGoogleRemember,
  };
};

export default useGoogleSignIn;
