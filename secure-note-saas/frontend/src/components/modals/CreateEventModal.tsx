import React, { useState } from 'react';

export interface CalendarEvent {
  id: string | number;
  title: string;
  date: string; // YYYY-MM-DD format or day number
  time?: string;
  category?: string;
  description?: string;
  color?: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: CalendarEvent) => void;
  initialDate?: string;
}

const EVENT_CATEGORIES = [
  { id: 'Meeting', label: 'Team Meeting', icon: '🤝', color: 'from-indigo-500 to-indigo-600' },
  { id: 'Review', label: 'Design & Code Review', icon: '🎨', color: 'from-emerald-500 to-emerald-600' },
  { id: 'Deadline', label: 'Project Deadline', icon: '🎯', color: 'from-amber-500 to-amber-600' },
  { id: 'Release', label: 'Product Release', icon: '🚀', color: 'from-purple-500 to-purple-600' },
  { id: 'Personal', label: 'Personal Reminder', icon: '👤', color: 'from-rose-500 to-rose-600' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  initialDate,
}) => {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('10:00');
  const [category, setCategory] = useState(EVENT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    // Format time to 12-hour AM/PM string
    const [h, m] = eventTime.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const formattedTime = `${hour}:${m} ${ampm}`;

    const newEv: CalendarEvent = {
      id: Date.now(),
      title: title.trim(),
      date: eventDate,
      time: formattedTime,
      category: category.label,
      description: description.trim(),
      color: category.color,
    };

    setTimeout(() => {
      onAddEvent(newEv);
      setTitle('');
      setDescription('');
      setLoading(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-6 text-white relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              📅
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Schedule New Event</h2>
              <p className="text-indigo-200 text-xs sm:text-sm">
                Add meetings, project milestones, and reminders to your schedule.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Architecture Review & Sprint Planning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-base"
            />
          </div>

          {/* Event Category Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Event Type & Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EVENT_CATEGORIES.map((cat) => {
                const isSelected = category.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center space-x-2.5 px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Event Time
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Event Details / Notes
            </label>
            <textarea
              rows={4}
              placeholder="Add agenda, meeting link, or reminder details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-normal focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed resize-y"
            ></textarea>
          </div>

          {/* Tip Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div className="text-xs text-indigo-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Calendar Sync:</strong>
              Events added to your schedule are automatically color-coded and displayed on your calendar view.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Event...</span>
                </>
              ) : (
                <>
                  <span>📅 Save Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
