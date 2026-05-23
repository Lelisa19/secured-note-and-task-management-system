const RolesPermissionsPage = () => {
  const roles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full access to all workspace features',
      members: 1,
      permissions: { createNotes: true, editNotes: true, deleteNotes: true, manageTasks: true, manageMembers: true },
    },
    {
      id: 2,
      name: 'Member',
      description: 'Can create and edit notes and tasks',
      members: 2,
      permissions: { createNotes: true, editNotes: true, deleteNotes: false, manageTasks: true, manageMembers: false },
    },
    {
      id: 3,
      name: 'Guest',
      description: 'Can view notes only',
      members: 1,
      permissions: { createNotes: false, editNotes: false, deleteNotes: false, manageTasks: false, manageMembers: false },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-600">Manage workspace roles and permissions.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
          + Create Role
        </button>
      </div>

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
                <button className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
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
    </div>
  );
};

export default RolesPermissionsPage;
