import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: 'bg-slate-200',
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { score, label: 'Good', color: 'bg-emerald-500' };
    return { score, label: 'Strong', color: 'bg-indigo-600' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setApiError(null);

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (formData.password !== formData.confirmPassword) {
      setApiError('Passwords do not match');
      return;
    }
    if (!formData.terms) {
      setApiError('Please accept the Terms of Service and Privacy Policy');
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialUnavailable = (provider: string) => {
    alert(`${provider} sign-up is coming soon. Please use email & password for now.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-bold mb-4">SecureFlow</h1>
              <p className="text-xl text-white/90 mb-8">
                Secure your notes, tasks, and ideas in one private workspace.
              </p>
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="font-semibold">End-to-End Encryption</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold">Real-Time Sync</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="font-semibold">Team Collaboration</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="font-semibold">Favorites & Reminders</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-600">Start your free 14-day trial today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 pointer-events-none">
                  Full name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 pointer-events-none">
                  Password
                </label>
              </div>

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Password strength</span>
                    <span className={`font-medium ${passwordStrength.score <= 1 ? 'text-red-600' : passwordStrength.score === 2 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-2 text-xs text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 pointer-events-none">
                  Confirm password
                </label>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
                )}
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500"
                  required
                />
                <span className="text-slate-600 text-sm">
                  I agree to the <span className="text-indigo-600 font-medium">Terms of Service</span> and{' '}
                  <span className="text-indigo-600 font-medium">Privacy Policy</span>
                </span>
              </label>

              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
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
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
