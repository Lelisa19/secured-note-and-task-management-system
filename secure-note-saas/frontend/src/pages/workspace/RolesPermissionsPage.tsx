const RolesPermissionsPage = () => {
  const roles: Array<{
    id: number;
    name: string;
    description: string;
    members: number;
    permissions: {
      createNotes: boolean;
      editNotes: boolean;
      deleteNotes: boolean;
      manageTasks: boolean;
      manageMembers: boolean;
    };
  }> = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-600">Manage workspace roles and permissions.</p>
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          onClick={() => { alert('Role creation not yet wired in the backend.'); }}
        >
          + Create Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Roles Configured Yet</h3>
          <p className="text-slate-500 text-xs mb-4 max-w-sm mx-auto">
            Define workspace roles with granular access controls for notes, tasks, and team members.
          </p>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
            onClick={() => { alert('Role creation not yet wired in the backend.'); }}
          >
            + Create Role
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{role.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{role.members} members</span>
                  </div>
                  <p className="text-slate-600">{role.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    onClick={() => { alert('Role edit flow not yet wired in the backend.'); }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    onClick={() => { alert('Role deletion not yet wired in the backend.'); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(role.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded ${value ? 'bg-emerald-500' : 'bg-slate-300'} flex items-center justify-center`}>
                      {value && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm text-slate-600">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsPage;
