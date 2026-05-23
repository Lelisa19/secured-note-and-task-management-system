import { useState, useEffect, useRef } from 'react';

const TwoFactorPage = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleResend = () => {
    setCanResend(false);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 text-center">
          {!isSuccess ? (
            <>
              {/* 2FA Illustration */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-5xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Two-Factor Authentication</h1>
                <p className="text-slate-600">
                  Enter the 6-digit verification code from your authenticator app.
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Timer & Resend */}
              <div className="mb-6">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-slate-500">
                    Resend code in {timer}s
                  </p>
                )}
              </div>

              {/* Trust Device Checkbox */}
              <label className="flex items-center justify-center space-x-2 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="text-slate-600 text-sm">Trust this device for 30 days</span>
              </label>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying || otp.some(d => !d)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify'
                )}
              </button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-5xl">✅</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Verification successful!</h1>
                <p className="text-slate-600">
                  Your identity has been verified. Redirecting you to your dashboard...
                </p>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02]">
                Continue to dashboard
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            SecureFlow · Enterprise-grade security for your productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;
