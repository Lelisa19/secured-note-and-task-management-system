import { useState } from 'react';

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const SystemSettingsPage = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [apiKeysVisible, setApiKeysVisible] = useState(false);
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([
    { id: 'ft-001', name: 'New Dashboard UI', description: 'Enable the new dashboard interface', enabled: true },
    { id: 'ft-002', name: 'AI Assistant', description: 'AI-powered suggestions and insights', enabled: false },
    { id: 'ft-003', name: 'Enhanced Security', description: 'Advanced security features and monitoring', enabled: true },
    { id: 'ft-004', name: 'Workspace Analytics', description: 'Detailed workspace performance analytics', enabled: true },
  ]);

  const toggleFeature = (id: string) => {
    setFeatureToggles(featureToggles.map(ft => 
      ft.id === id ? { ...ft, enabled: !ft.enabled } : ft
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600">Manage system configuration and settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Reset to Defaults
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">System Health Overview</h3>
                <p className="text-sm text-slate-500">Current system status and health</p>
              </div>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                All Systems Operational
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'API Servers', status: 'healthy', uptime: '99.9%', response: '45ms' },
                { name: 'Database', status: 'healthy', uptime: '99.8%', response: '12ms' },
                { name: 'File Storage', status: 'healthy', uptime: '99.9%', response: '89ms' },
                { name: 'Email Service', status: 'warning', uptime: '98.5%', response: '234ms' },
              ].map((service, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{service.name}</span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      service.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        service.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></div>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Uptime: {service.uptime}</span>
                    <span>Response: {service.response}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Feature Toggles</h3>
            <div className="space-y-4">
              {featureToggles.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">{feature.name}</p>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      feature.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        feature.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">API Keys Management</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900">Production API Key</p>
                    <p className="text-sm text-slate-500">Used for production environment</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setApiKeysVisible(!apiKeysVisible)}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {apiKeysVisible ? '🙈' : '👁️'}
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                      📋
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      🔄
                    </button>
                  </div>
                </div>
                <div className="font-mono text-sm text-slate-700 bg-slate-100 rounded-lg px-4 py-2">
                  {apiKeysVisible ? 'sk_live_abc123def456ghi789jkl' : '•••••••••••••••••••••••••'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900">Test API Key</p>
                    <p className="text-sm text-slate-500">Used for testing and development</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                      👁️
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                      📋
                    </button>
                  </div>
                </div>
                <div className="font-mono text-sm text-slate-700 bg-slate-100 rounded-lg px-4 py-2">
                  sk_test_xyz123test456test789
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                <span>➕</span>
                Generate New API Key
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Maintenance Mode</h3>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  maintenanceMode ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              When enabled, only administrators will be able to access the system. All other users will see a maintenance page.
            </p>
            {maintenanceMode && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ Maintenance mode is currently active!
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Email Server Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.secureflow.com"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Port</label>
                <input
                  type="text"
                  defaultValue="587"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Email</label>
                <input
                  type="email"
                  defaultValue="noreply@secureflow.com"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                Test Email Connection
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Backup & Restore</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                <span>💾</span>
                Create Backup Now
              </button>
              <button className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <span>📥</span>
                Restore from Backup
              </button>
              <p className="text-xs text-slate-500 text-center">
                Last backup: 2 hours ago
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Security Policies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Two-Factor Auth Required</span>
                <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-indigo-600">
                  <span className="inline-block h-4 w-4 translate-x-5 transform rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Session Timeout (30 min)</span>
                <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-indigo-600">
                  <span className="inline-block h-4 w-4 translate-x-5 transform rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">IP Whitelisting</span>
                <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-slate-300">
                  <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
