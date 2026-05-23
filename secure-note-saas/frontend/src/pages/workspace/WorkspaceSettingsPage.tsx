const WorkspaceSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Workspace Settings</h1>
        <p className="text-slate-600">Manage your workspace preferences and settings.</p>
      </div>

      <div className="space-y-6">
        {/* Workspace Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Workspace Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workspace Name</label>
              <input type="text" defaultValue="Design Team" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workspace Description</label>
              <textarea defaultValue="Our product design team workspace" rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Workspace Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  SF
                </div>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                  Upload Logo
                </button>
              </div>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <p className="text-slate-600">Deleting this workspace will permanently remove all data and cannot be undone.</p>
            <button className="px-6 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
