import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const authStorage = rememberMe ? localStorage : sessionStorage;
      authStorage.setItem('token', data.token);
      authStorage.setItem('user', JSON.stringify(data.user));
      if (rememberMe) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialUnavailable = (provider: string) => {
    alert(`${provider} sign-in is coming soon. Please use email & password for now.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-600">Sign in to your SecureFlow account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setApiError(null); }}
                  className="w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 pointer-events-none">
                  Email address
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setApiError(null); }}
                  className="w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {apiError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-slate-600 text-sm">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-indigo-600 text-sm font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialUnavailable('Google')}
                  className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-2 text-xl">G</span>
                  <span className="font-medium text-slate-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialUnavailable('GitHub')}
                  className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-2 text-xl">🐙</span>
                  <span className="font-medium text-slate-700">GitHub</span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl font-bold mb-4">SecureFlow</h2>
              <p className="text-xl text-white/90 mb-8">
                Secure your notes, tasks, and ideas in one private workspace.
              </p>
              <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/30 p-4 rounded-2xl">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="font-semibold text-sm">End-to-End Encryption</div>
                  </div>
                  <div className="bg-white/30 p-4 rounded-2xl">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="font-semibold text-sm">Real-Time Sync</div>
                  </div>
                </div>
                <div className="bg-white/30 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Why SecureFlow?</span>
                  </div>
                  <ul className="text-left text-sm space-y-2 text-white/90">
                    <li className="flex items-start gap-2"><span>✓</span><span>All your notes, synced across devices</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Organize tasks & projects in workspaces</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Invite your team to collaborate</span></li>
                    <li className="flex items-start gap-2"><span>✓</span><span>Favorites, tags & reminders to stay focused</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
