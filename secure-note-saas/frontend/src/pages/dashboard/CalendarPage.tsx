import { useState } from 'react';
import { CreateEventModal, type CalendarEvent } from '../../components/modals/CreateEventModal';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string>('');

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [upcomingReminders, setUpcomingReminders] = useState<{ id: number; title: string; due: string }[]>([]);

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleOpenModal = (dateStr?: string) => {
    if (dateStr) {
      setSelectedDateForModal(dateStr);
    } else {
      const formattedMonth = String(currentMonth + 1).padStart(2, '0');
      const formattedDay = String(today.getDate()).padStart(2, '0');
      setSelectedDateForModal(`${currentYear}-${formattedMonth}-${formattedDay}`);
    }
    setIsModalOpen(true);
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    // Also add to reminders list if personal
    setUpcomingReminders((prev) => [
      { id: Date.now(), title: newEvent.title, due: `${newEvent.date} (${newEvent.time || 'All day'})` },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-slate-600 text-sm sm:text-base">Manage your schedule, deliverables, and team events.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToday}
            className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
          >
            Today
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
          >
            <span>+ New Event</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View Container */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center font-bold text-lg"
                title="Previous Month"
              >
                ←
              </button>
              <button
                onClick={handleNextMonth}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center font-bold text-lg"
                title="Next Month"
              >
                →
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty Offset Boxes for start of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`offset-${idx}`} className="min-h-[105px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 opacity-40"></div>
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dateNum) => {
              const formattedMonth = String(currentMonth + 1).padStart(2, '0');
              const formattedDay = String(dateNum).padStart(2, '0');
              const fullDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

              const isToday =
                today.getDate() === dateNum &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;

              // Find events for this date (support exact YYYY-MM-DD or date number matching)
              const dayEvents = events.filter((e) => {
                if (typeof e.date === 'string' && e.date.includes('-')) {
                  return e.date === fullDateStr;
                }
                return Number(e.date) === dateNum;
              });

              return (
                <div
                  key={dateNum}
                  onClick={() => handleOpenModal(fullDateStr)}
                  className={`min-h-[105px] p-2.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isToday
                      ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-200'
                      : 'bg-white border-slate-150 hover:bg-slate-50/80 hover:border-indigo-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-800'
                      }`}
                    >
                      {dateNum}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </span>
                  </div>

                  {/* Events list inside cell */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${
                          ev.color || 'from-indigo-600 to-indigo-700'
                        } text-white truncate shadow-xs`}
                        title={`${ev.title} (${ev.time || 'All day'})`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Reminders & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🔔</span>
              <span>Upcoming Reminders</span>
            </h2>
            <div className="space-y-3">
              {upcomingReminders.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-4">No upcoming reminders</p>
              ) : (
                upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">{reminder.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <span>⏰</span>
                      <span>{reminder.due}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleOpenModal()}
                className="w-full flex items-center justify-start space-x-3 p-3.5 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-700 border border-slate-150 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="text-base">⏰</span>
                <span>Add Reminder</span>
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="w-full flex items-center justify-start space-x-3 p-3.5 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-700 border border-slate-150 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="text-base">📅</span>
                <span>Schedule Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
        initialDate={selectedDateForModal}
      />
    </div>
  );
};

export default CalendarPage;
