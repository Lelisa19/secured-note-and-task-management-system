import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

const DashboardOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [data, setData] = useState<{
    stats: {
      totalNotes: number;
      completedTasks: number;
      upcomingTasks: number;
      totalWorkspaces: number;
    };
    recentNotes: Array<{ id: string; title: string; content: string; createdAt: string; tags: string[] }>;
    upcomingTasks: Array<{ id: string; title: string; priority: string; dueDate?: string; status: string }>;
    recentActivity: Array<{ id: string; action: string; createdAt: string }>;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const result = await apiRequest('/dashboard/stats');
      setData(result);
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateNote = async () => {
    const title = prompt('Enter note title:');
    if (!title) return;
    try {
      await apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content: '', tags: [] }),
      });
      fetchStats();
    } catch (error: any) {
      alert(error.message || 'Failed to create note');
    }
  };

  const handleCreateTask = async () => {
    const title = prompt('Enter task title:');
    if (!title) return;
    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, status: 'TODO', priority: 'MEDIUM' }),
      });
      fetchStats();
    } catch (error: any) {
      alert(error.message || 'Failed to create task');
    }
  };

  const statsList = data ? [
    {
      icon: '📝',
      label: 'Total Notes',
      value: String(data.stats.totalNotes),
      change: 'Active',
      positive: true,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '✅',
      label: 'Completed Tasks',
      value: String(data.stats.completedTasks),
      change: 'Done',
      positive: true,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: '📅',
      label: 'Upcoming Tasks',
      value: String(data.stats.upcomingTasks),
      change: 'Pending',
      positive: false,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '👥',
      label: 'Workspaces Joined',
      value: String(data.stats.totalWorkspaces),
      change: 'Active',
      positive: true,
      color: 'from-amber-500 to-amber-600',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning, {user?.fullName || 'User'}! 👋</h1>
          <p className="text-slate-600">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleCreateNote}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            + New Note
          </button>
        </div>
      </div>

      {/* Productivity Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Notes</h2>
          </div>
          <div className="space-y-4">
            {(data?.recentNotes || []).length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No recent notes found.</p>
            ) : (
              (data?.recentNotes || []).map((note) => (
                <div key={note.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{note.title}</h3>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                      {note.tags[0] || 'Note'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {note.content || 'No content yet'}
                  </p>
                  <p className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Upcoming Tasks</h2>
          </div>
          <div className="space-y-3">
            {(data?.upcomingTasks || []).length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No upcoming tasks found.</p>
            ) : (
              (data?.upcomingTasks || []).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 ${task.status === 'DONE' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'} flex items-center justify-center text-white text-xs`}>
                      {task.status === 'DONE' && '✓'}
                    </div>
                    <span className={`text-sm ${task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                    task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Activity Feed</h2>
          </div>
          <div className="space-y-4">
            {(data?.recentActivity || []).length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No recent activity found.</p>
            ) : (
              (data?.recentActivity || []).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{user?.fullName || 'User'}</span> performed action:{' '}
                      <span className="text-indigo-600 font-medium">{activity.action.replace(/_/g, ' ')}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={handleCreateNote}
              className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl">📝</span>
              <span className="text-sm font-medium text-slate-900">Create new note</span>
            </button>
            <button 
              onClick={handleCreateTask}
              className="w-full flex items-center justify-start space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium text-slate-900">Add new task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
