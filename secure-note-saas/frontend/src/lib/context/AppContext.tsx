import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getAuthToken, clearAuthStorage } from '../api';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logo?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role?: string;
}

interface AppContextType {
  user: User | null;
  workspaces: Workspace[];
  invitationCount: number;
  loading: boolean;
  refreshWorkspaces: () => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [invitationCount, setInvitationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiRequest<User>('/auth/me');
      setUser(me);
      const userStr = JSON.stringify(me);
      if (localStorage.getItem('token')) {
        localStorage.setItem('user', userStr);
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('user', userStr);
      }
    } catch {
      clearAuthStorage();
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const refreshWorkspaces = useCallback(async () => {
    try {
      const [wsList, invites] = await Promise.all([
        apiRequest<Workspace[]>('/workspaces'),
        apiRequest<unknown[]>('/workspaces/invitations'),
      ]);
      setWorkspaces(wsList);
      setInvitationCount(invites.length || 0);
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([refreshUser(), refreshWorkspaces()]).finally(() => setLoading(false));
  }, [refreshUser, refreshWorkspaces]);

  return (
    <AppContext.Provider
      value={{
        user,
        workspaces,
        invitationCount,
        loading,
        refreshWorkspaces,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
