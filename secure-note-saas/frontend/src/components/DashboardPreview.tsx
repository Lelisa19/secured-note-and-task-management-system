const DashboardPreview = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            A dashboard that keeps you focused
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Clean, intuitive interface designed for maximum productivity.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="col-span-3 space-y-4">
                <div className="h-12 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl flex items-center px-4 text-white font-semibold">
                  Dashboard
                </div>
                <div className="h-10 bg-slate-50 rounded-lg flex items-center px-4 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                  Notes
                </div>
                <div className="h-10 bg-slate-50 rounded-lg flex items-center px-4 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                  Tasks
                </div>
                <div className="h-10 bg-slate-50 rounded-lg flex items-center px-4 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                  Calendar
                </div>
                <div className="h-10 bg-slate-50 rounded-lg flex items-center px-4 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                  Team
                </div>
              </div>
              
              {/* Main Content */}
              <div className="col-span-9">
                {/* Analytics Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-2xl text-white">
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm opacity-90">New Notes</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-2xl text-white">
                    <div className="text-3xl font-bold">18</div>
                    <div className="text-sm opacity-90">Completed</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl text-white">
                    <div className="text-3xl font-bold">5</div>
                    <div className="text-sm opacity-90">In Progress</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white">
                    <div className="text-3xl font-bold">3</div>
                    <div className="text-sm opacity-90">Pending</div>
                  </div>
                </div>
                
                {/* Notes & Tasks Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Notes Preview */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Notes</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Kanban Tasks */}
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Task Board</h3>
                    <div className="space-y-3">
                      {['To Do', 'In Progress', 'Done'].map((status, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200">
                          <span className="text-sm font-medium text-slate-700">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
