import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface ActivityItem {
  id: string | number;
  user: string;
  action: string;
  item: string;
  time: string;
  avatar: string;
  type: string;
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const userName = userObj?.fullName || 'You';
      const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

      const res = await apiRequest('/dashboard/stats');
      const recentAct = res?.recentActivity || [];
      if (Array.isArray(recentAct) && recentAct.length > 0) {
        setActivities(
          recentAct.map((a: any, idx: number) => ({
            id: a.id || idx,
            user: userName,
            action: a.action || 'performed an action',
            item: a.target || '',
            time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Recently',
            avatar: userInitials,
            type: 'activity',
          }))
        );
      } else {
        setActivities([]);
      }
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Personal Activity</h1>
          <p className="text-slate-600">Track your personal activity and document updates.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
          <div className="text-4xl mb-3">⚡</div>
          <p className="font-semibold text-slate-800 text-sm mb-1">No Activity Logs Yet</p>
          <p>Your recent note creations, task updates, and logins will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity, idx) => (
            <div key={activity.id} className="relative">
              {idx < activities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-200"></div>
              )}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                  {activity.avatar}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="text-indigo-600 font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
