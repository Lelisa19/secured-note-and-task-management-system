const ProfilePage = () => {
  const stats = [
    { label: 'Notes Created', value: '128' },
    { label: 'Tasks Completed', value: '45' },
    { label: 'Days Active', value: '32' },
    { label: 'Collaborations', value: '8' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                JD
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">John Doe</h2>
              <p className="text-slate-600 mb-4">Product Designer</p>
              <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" defaultValue="john@example.com" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea rows={4} defaultValue="Product designer with a passion for creating beautiful and functional user interfaces." className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="url" placeholder="Twitter" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                <input type="url" placeholder="GitHub" className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="pt-4">
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
