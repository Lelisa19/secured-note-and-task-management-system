import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { CreateTaskModal } from '../../components/modals/CreateTaskModal';

interface TaskItem {
  id: string | number;
  title: string;
  assignee: string;
  priority: string;
  due: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const TeamTasksPage = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        setWorkspaceId(wsId);
        try {
          const rawTasks = await apiRequest(`/tasks?workspaceId=${wsId}`);
          const items = rawTasks?.data || rawTasks || [];
          if (Array.isArray(items)) {
            setTasks(
              items.map((t: any) => ({
                id: t.id || t._id,
                title: t.title || 'Untitled Task',
                assignee: 'TM',
                priority: t.priority ? t.priority.charAt(0) + t.priority.slice(1).toLowerCase() : 'Medium',
                due: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Flexible',
                status: t.status === 'DONE' ? 'DONE' : t.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'TODO',
              }))
            );
          }
        } catch {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');

  const columns = [
    { id: 'todo', title: 'Todo', icon: '📋', tasks: todoTasks },
    { id: 'in-progress', title: 'In Progress', icon: '⚡', tasks: inProgressTasks },
    { id: 'completed', title: 'Completed', icon: '✅', tasks: completedTasks },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Tasks</h1>
          <p className="text-slate-600">Collaborate on task boards and track progress across team sprints.</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02]"
        >
          <span>✅ + New Task</span>
        </button>
      </div>

      {/* Informational Guidance Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <span className="text-xl leading-none">💡</span>
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">Sprint Kanban Board:</strong> Click + New Task to set up deliverables with priority tags, assignee avatars, and workspace deadline tracking.
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Team Tasks Created Yet</h3>
          <p className="text-slate-500 text-xs mb-4 max-w-sm mx-auto">
            Create tasks to assign deliverables, set deadlines, and track team progress on Kanban boards.
          </p>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + New Task
          </button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80 bg-slate-100/90 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{column.icon}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{column.title}</h3>
                </div>
                <span className="text-xs font-semibold bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-sm">
                  {column.tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {column.tasks.length === 0 ? (
                  <div className="p-4 bg-white/50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    No tasks in {column.title}
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {task.priority === 'High' ? '🔴 High' : task.priority === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                        </span>
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                          {task.assignee}
                        </div>
                      </div>
                      <h4 className="font-medium text-slate-900 text-sm mb-2">{task.title}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span>📅</span>
                        <span>Due: {task.due}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        workspaceId={workspaceId || undefined}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default TeamTasksPage;
