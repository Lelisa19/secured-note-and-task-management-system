const CalendarPage = () => {
  const daysInMonth = 31;
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const events = [
    { id: 1, date: 15, title: 'Team Standup', time: '10:00 AM', color: 'from-indigo-500 to-indigo-600' },
    { id: 2, date: 18, title: 'Design Review', time: '2:00 PM', color: 'from-emerald-500 to-emerald-600' },
    { id: 3, date: 22, title: 'Project Deadline', time: '5:00 PM', color: 'from-amber-500 to-amber-600' },
  ];

  const upcomingReminders = [
    { id: 1, title: 'Submit report', due: 'Today, 3:00 PM' },
    { id: 2, title: 'Team meeting', due: 'Tomorrow, 10:00 AM' },
    { id: 3, title: 'Review tasks', due: 'Friday, 2:00 PM' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-600">Manage your schedule and events.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
            Today
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">May 2025</h2>
            <div className="flex space-x-2">
              <button className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">←</button>
              <button className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">→</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-center text-sm font-semibold text-slate-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
              const dayEvents = events.filter(e => e.date === date);
              return (
                <div key={date} className="min-h-[100px] p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="text-sm font-medium text-slate-900 mb-1">{date}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div key={event.id} className={`text-xs p-2 rounded-lg bg-gradient-to-r ${event.color} text-white truncate`}>
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Upcoming Reminders</h2>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="font-medium text-slate-900">{reminder.title}</div>
                  <div className="text-xs text-slate-500">{reminder.due}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Add</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">Add Reminder</button>
              <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">Schedule Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
