import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center">
          {!isVerified ? (
            <>
              {/* Verification Pending State */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-5xl">📧</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Verify your email</h1>
                <p className="text-slate-600">
                  We've sent a verification link to your email address. Please click the link to verify your account.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resending...
                    </div>
                  ) : (
                    'Resend verification email'
                  )}
                </button>

                <button
                  onClick={() => setIsVerified(true)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02]"
                >
                  I've verified my email
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Verification Success State */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-5xl">✅</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Email verified!</h1>
                <p className="text-slate-600">
                  Your email has been successfully verified. You can now access your SecureFlow account.
                </p>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02]"
              >
                Continue to dashboard
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            SecureFlow · The most secure way to organize your notes, tasks, and ideas
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
