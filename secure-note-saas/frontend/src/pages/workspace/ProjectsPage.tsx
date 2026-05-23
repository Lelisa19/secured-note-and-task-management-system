const ProjectsPage = () => {
  const projects = [
    { id: 1, name: 'SecureFlow App', progress: 75, tasks: 12, completed: 9, deadline: 'June 15, 2025', team: ['JD', 'JS', 'MJ'], tag: 'Product' },
    { id: 2, name: 'Marketing Website', progress: 40, tasks: 20, completed: 8, deadline: 'July 1, 2025', team: ['JD', 'DK'], tag: 'Design' },
    { id: 3, name: 'API Integration', progress: 90, tasks: 10, completed: 9, deadline: 'May 30, 2025', team: ['MJ'], tag: 'Engineering' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage your workspace projects.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{project.tag}</span>
              <div className="flex -space-x-2">
                {project.team.map((avatar, idx) => (
                  <div key={idx} className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {avatar}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{project.name}</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{project.completed}/{project.tasks} tasks</span>
                <span className="text-sm font-bold text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Deadline: {project.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
