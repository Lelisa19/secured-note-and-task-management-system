import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { CreateProjectModal } from '../../components/workspace/CreateProjectModal';

interface Project {
  id: string | number;
  name: string;
  description?: string;
  progress?: number;
  tasks?: number;
  completed?: number;
  deadline?: string;
  team?: string[];
  tag?: string;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        setWorkspaceId(wsId);
        try {
          const res = await apiRequest(`/workspaces/${wsId}/projects`);
          const items = res?.data || res || [];
          if (Array.isArray(items)) {
            setProjectsList(
              items.map((p: any) => ({
                id: p.id || p._id,
                name: p.name || 'Untitled Project',
                description: p.description || '',
                progress: p.progress || 0,
                tasks: p.tasks || 0,
                completed: p.completed || 0,
                deadline: p.deadline || 'Flexible',
                team: p.team || ['TM'],
                tag: p.tag || 'Project',
              }))
            );
          }
        } catch {
          setProjectsList([]);
        }
      } else {
        setProjectsList([]);
      }
    } catch {
      setProjectsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Projects</h1>
          <p className="text-slate-600">Track and manage project deliverables for your team.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02]"
        >
          <span>🚀 + New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projectsList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Projects Created Yet</h3>
          <p className="text-slate-500 text-xs mb-4 max-w-sm mx-auto">
            Create project milestones to group tasks and track team deliverables.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full">
                    {project.tag || 'Project'}
                  </span>
                  <div className="flex -space-x-2">
                    {(project.team || ['TM']).map((avatar, idx) => (
                      <div key={idx} className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {avatar}
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">
                      {project.completed || 0}/{project.tasks || 0} tasks finished
                    </span>
                    <span className="text-xs font-bold text-indigo-600">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
                <span>📅 Deadline: {project.deadline || 'Flexible'}</span>
                <button
                  type="button"
                  onClick={() => navigate(workspaceId ? `/workspace/${workspaceId}/tasks` : '/dashboard/tasks')}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  View Tasks →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspaceId={workspaceId}
        onSuccess={loadProjects}
      />
    </div>
  );
};

export default ProjectsPage;
