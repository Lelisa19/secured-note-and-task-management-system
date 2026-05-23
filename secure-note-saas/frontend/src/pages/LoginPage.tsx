import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login form submitted:', { email, password, rememberMe });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Login Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-600">Sign in to your SecureFlow account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-4 text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600">
                  Email address
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-4 text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
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
                <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-2 text-xl">G</span>
                  <span className="font-medium text-slate-700">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-2 text-xl">🐙</span>
                  <span className="font-medium text-slate-700">GitHub</span>
                </button>
              </div>
            </form>

            {/* Signup Redirect */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <a href="#" className="text-indigo-600 font-semibold hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>

          {/* Right Section - Illustration */}
          <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl font-bold mb-4">SecureFlow</h2>
              <p className="text-xl text-white/90 mb-8">
                Secure your notes, tasks, and ideas in one private workspace.
              </p>
              <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                    <span className="font-semibold">Dashboard</span>
                    <span className="text-sm opacity-80">Today</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/40 p-3 rounded-xl">
                      <div className="text-xl font-bold">128</div>
                      <div className="text-xs opacity-80">Notes</div>
                    </div>
                    <div className="bg-white/40 p-3 rounded-xl">
                      <div className="text-xl font-bold">45</div>
                      <div className="text-xs opacity-80">Tasks</div>
                    </div>
                    <div className="bg-white/40 p-3 rounded-xl">
                      <div className="text-xl font-bold">8</div>
                      <div className="text-xs opacity-80">Team</div>
                    </div>
                  </div>
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
