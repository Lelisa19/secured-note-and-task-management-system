import { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Forgot Password Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot password?</h1>
              <p className="text-slate-600">
                {isSuccess 
                  ? 'Check your email for a reset link' 
                  : 'Enter your email to receive a password reset link'}
              </p>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Security Reassurance */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-1">Your data is safe</h3>
                      <p className="text-sm text-emerald-700">
                        We'll never share your email or send you spam.
                      </p>
                    </div>
                  </div>
                </div>

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

                {/* Send Reset Link Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send reset link'
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <a href="#" className="text-indigo-600 font-medium hover:underline">
                    ← Back to login
                  </a>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Success State */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                    Reset link sent!
                  </h3>
                  <p className="text-emerald-700">
                    Check your email at {email} for instructions to reset your password.
                  </p>
                </div>

                {/* Help Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Didn't receive the email?</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• Try again in a few minutes</li>
                  </ul>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <a href="#" className="text-indigo-600 font-medium hover:underline">
                    ← Back to login
                  </a>
                </div>
              </div>
            )}
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

export default ForgotPasswordPage;
