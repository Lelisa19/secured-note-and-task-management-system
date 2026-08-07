import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { formatRelativeTime, formatDateTime } from '../../lib/format';

interface Reminder {
  id: string;
  title: string;
  message?: string;
  remindAt: string;
  isSent: boolean;
  task?: { title: string; priority: string };
}

const RemindersPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const fetchReminders = async () => {
    try {
      const data = await apiRequest<Reminder[]>('/dashboard/reminders');
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !remindAt) return;
    try {
      await apiRequest('/dashboard/reminders', {
        method: 'POST',
        body: JSON.stringify({ title: title.trim(), message: message.trim(), remindAt }),
      });
      setTitle('');
      setMessage('');
      setRemindAt('');
      setShowForm(false);
      fetchReminders();
    } catch (error: any) {
      alert(error.message || 'Failed to create reminder');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;
    try {
      await apiRequest(`/dashboard/reminders/${id}`, { method: 'DELETE' });
      fetchReminders();
    } catch (error: any) {
      alert(error.message || 'Failed to delete reminder');
    }
  };

  const upcoming = reminders.filter((r) => new Date(r.remindAt) >= new Date());
  const past = reminders.filter((r) => new Date(r.remindAt) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reminders</h1>
          <p className="text-slate-600">Never miss an important task or event.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          + New Reminder
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <input
            type="text"
            placeholder="Reminder title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl"
            required
          />
          <textarea
            placeholder="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl"
          />
          <input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
              Save Reminder
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 rounded-xl">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="text-5xl mb-3">⏰</div>
          <h3 className="font-semibold text-slate-900">No reminders yet</h3>
          <p className="text-sm text-slate-500 mt-1">Create your first reminder to stay on track.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase">Upcoming</h2>
              {upcoming.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} onDelete={handleDelete} />
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase">Past</h2>
              {past.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} onDelete={handleDelete} past />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReminderCard = ({
  reminder,
  onDelete,
  past,
}: {
  reminder: Reminder;
  onDelete: (id: string) => void;
  past?: boolean;
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <h3 className={`font-semibold text-lg ${past ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
          {reminder.title}
        </h3>
        {reminder.message && <p className="text-sm text-slate-600 mt-1">{reminder.message}</p>}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-slate-500">{formatDateTime(reminder.remindAt)}</span>
          {reminder.task && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
              Task: {reminder.task.title}
            </span>
          )}
          <span className="text-xs text-slate-400">{formatRelativeTime(reminder.remindAt)}</span>
        </div>
      </div>
      <button onClick={() => onDelete(reminder.id)} className="text-red-500 text-sm hover:underline">
        Delete
      </button>
    </div>
  </div>
);

export default RemindersPage;
