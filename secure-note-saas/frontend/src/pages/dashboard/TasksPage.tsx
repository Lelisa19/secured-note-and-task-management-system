import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
  dueDate?: string;
  user?: { fullName: string };
  assignee?: { fullName: string };
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await apiRequest('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    const title = prompt('Enter task title:');
    if (!title) return;
    const priorityInput = prompt('Enter priority (LOW, MEDIUM, HIGH):', 'MEDIUM')?.toUpperCase();
    const priority = ['LOW', 'MEDIUM', 'HIGH'].includes(priorityInput || '') ? priorityInput : 'MEDIUM';
    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          priority,
          status: 'TODO',
        }),
      });
      fetchTasks();
    } catch (error: any) {
      alert(error.message || 'Failed to create task');
    }
  };

  const handleMoveTask = async (taskId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, 'TODO' | 'IN_PROGRESS' | 'DONE'> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
    };
    const nextStatus = nextStatusMap[currentStatus] || 'TODO';
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchTasks();
    } catch (error: any) {
      alert(error.message || 'Failed to update task status');
    }
  };

  const columns = [
    { id: 'TODO', title: 'Todo', tasks: tasks.filter(t => t.status === 'TODO') },
    { id: 'IN_PROGRESS', title: 'In Progress', tasks: tasks.filter(t => t.status === 'IN_PROGRESS') },
    { id: 'DONE', title: 'Completed', tasks: tasks.filter(t => t.status === 'DONE') },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage your tasks and projects efficiently.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleCreateTask}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            + New Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  {column.title}
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </h3>
              </div>
              <div className="space-y-3">
                {column.tasks.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No tasks in this stage</p>
                ) : (
                  column.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => handleMoveTask(task.id, task.status)}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 group"
                      title="Click to move to next column"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          Move →
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-900 mb-3">{task.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {getInitials(task.assignee?.fullName || task.user?.fullName)}
                          </div>
                          <span className="text-xs text-slate-500">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;

