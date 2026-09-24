import { useState, useEffect } from 'react';

interface NotificationItem {
  id: string | number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Notifications initialized to empty array (no fake data)
    setNotifications([]);
    setLoading(false);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600">Stay updated with your workspace and personal account alerts.</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex space-x-3">
            <button 
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors text-xs font-semibold"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
          <div className="text-4xl mb-3">🔔</div>
          <p className="font-semibold text-slate-800 text-sm mb-1">All Caught Up!</p>
          <p>You have no unread notifications or pending team alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  notification.type === 'reminder' ? 'bg-amber-100' :
                  notification.type === 'activity' ? 'bg-indigo-100' :
                  'bg-emerald-100'
                }`}>
                  {notification.type === 'reminder' ? '🔔' :
                   notification.type === 'activity' ? '💬' :
                   '👥'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-lg ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
