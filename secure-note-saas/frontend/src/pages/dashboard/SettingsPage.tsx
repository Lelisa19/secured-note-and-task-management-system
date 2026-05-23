import { useState } from 'react';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <nav className="space-y-1">
            {['General', 'Theme', 'Notifications', 'Language', 'Accessibility', 'Privacy'].map((item, idx) => (
              <button key={idx} className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${idx === 0 ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Email notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Desktop notifications</span>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600" />
                </label>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Theme Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="text-2xl mb-2">☀️</div>
                <div className="text-sm font-medium">Light</div>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="text-2xl mb-2">🌙</div>
                <div className="text-sm font-medium">Dark</div>
              </button>
              <button 
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="text-2xl mb-2">💻</div>
                <div className="text-sm font-medium">System</div>
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Language</h3>
            <select defaultValue="en" className="w-full px-4 py-2 border border-slate-200 rounded-xl">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="pt-4">
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
