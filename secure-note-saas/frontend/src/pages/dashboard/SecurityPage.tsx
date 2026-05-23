const SecurityPage = () => {
  const activeSessions = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 min ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Boston, USA', lastActive: '1 hour ago', current: false },
  ];

  const loginHistory = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', time: 'Today, 10:30 AM', success: true },
    { id: 2, device: 'Firefox on macOS', location: 'San Francisco, USA', time: 'Yesterday, 3:45 PM', success: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Security</h1>
        <p className="text-slate-600">Manage your account security and privacy settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Management */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Password</h3>
              <p className="text-sm text-slate-600">Change your account password.</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">🔐</div>
          </div>
          <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            Change Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600">Add an extra layer of security.</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">🛡️</div>
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            Enable 2FA
          </button>
        </div>

        {/* Active Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Sessions</h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{session.device}</span>
                    {session.current && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Current</span>}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{session.location}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{session.lastActive}</span>
                  {!session.current && <button className="text-red-600 text-sm font-medium hover:underline">Revoke</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Login History</h3>
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-medium text-slate-900">{login.device}</div>
                  <div className="text-sm text-slate-500 mt-1">{login.location}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{login.time}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${login.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {login.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
