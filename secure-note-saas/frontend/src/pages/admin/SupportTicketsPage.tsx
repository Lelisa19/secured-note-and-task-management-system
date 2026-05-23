import { useState } from 'react';

interface Ticket {
  id: string;
  subject: string;
  user: {
    name: string;
    email: string;
  };
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  priorityLabel: string;
  assignedAgent: string | null;
  createdAt: string;
  lastUpdated: string;
  category: string;
  messages: number;
  slaStatus: 'ok' | 'warning' | 'overdue';
}

const SupportTicketsPage = () => {
  const [tickets] = useState<Ticket[]>([
    { id: 'TK-001', subject: 'Cannot access my workspace', user: { name: 'John Doe', email: 'john@example.com' }, status: 'open', priority: 'high', priorityLabel: 'High', assignedAgent: 'Sarah Admin', createdAt: '2 hours ago', lastUpdated: '30 minutes ago', category: 'Access', messages: 5, slaStatus: 'ok' },
    { id: 'TK-002', subject: 'Billing issue with subscription', user: { name: 'Sarah Miller', email: 'sarah@example.com' }, status: 'pending', priority: 'urgent', priorityLabel: 'Urgent', assignedAgent: 'Mike Support', createdAt: '4 hours ago', lastUpdated: '1 hour ago', category: 'Billing', messages: 8, slaStatus: 'warning' },
    { id: 'TK-003', subject: 'Feature request: dark mode', user: { name: 'Mike Johnson', email: 'mike@example.com' }, status: 'resolved', priority: 'low', priorityLabel: 'Low', assignedAgent: null, createdAt: '1 day ago', lastUpdated: '2 hours ago', category: 'Feature', messages: 3, slaStatus: 'ok' },
    { id: 'TK-004', subject: 'Two-factor authentication not working', user: { name: 'Emily Davis', email: 'emily@example.com' }, status: 'open', priority: 'urgent', priorityLabel: 'Urgent', assignedAgent: 'Sarah Admin', createdAt: '30 minutes ago', lastUpdated: '10 minutes ago', category: 'Security', messages: 12, slaStatus: 'overdue' },
    { id: 'TK-005', subject: 'Notes not syncing', user: { name: 'David Wilson', email: 'david@example.com' }, status: 'pending', priority: 'medium', priorityLabel: 'Medium', assignedAgent: 'Mike Support', createdAt: '5 hours ago', lastUpdated: '2 hours ago', category: 'Technical', messages: 6, slaStatus: 'warning' },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All Priorities' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getSlaIndicatorClass = (sla: string) => {
    switch (sla) {
      case 'ok': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-600">Manage and respond to customer support requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
            + New Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Open Tickets', value: '12', color: 'from-red-500 to-red-600', icon: '📋' },
          { label: 'Pending', value: '8', color: 'from-amber-500 to-amber-600', icon: '⏳' },
          { label: 'Resolved Today', value: '24', color: 'from-emerald-500 to-emerald-600', icon: '✅' },
          { label: 'Avg Response Time', value: '2.4h', color: 'from-blue-500 to-blue-600', icon: '⏱️' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
                <span className="text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-slate-700"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Status</option>
                <option>Open</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Ticket</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Assigned</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">SLA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{ticket.id}</p>
                      <p className="text-sm text-slate-600">{ticket.subject}</p>
                    </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{ticket.user.name}</p>
                      <p className="text-xs text-slate-500">{ticket.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priorityLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.assignedAgent ? (
                      <span className="text-sm text-slate-700">{ticket.assignedAgent}</span>
                    ) : (
                      <span className="text-sm text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSlaIndicatorClass(ticket.slaStatus)}`}>
                      {ticket.slaStatus.charAt(0).toUpperCase() + ticket.slaStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-slate-600">{ticket.messages} messages</p>
                      <p className="text-xs text-slate-500">{ticket.lastUpdated}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedTicket.id}</h2>
                <p className="text-slate-500">{selectedTicket.subject}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-2">User</h4>
                  <p className="font-medium text-slate-900">{selectedTicket.user.name}</p>
                  <p className="text-sm text-slate-600">{selectedTicket.user.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTicket.status)}`}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                      {selectedTicket.priorityLabel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Created: {selectedTicket.createdAt}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-slate-900 mb-4">Ticket Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-medium text-slate-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Assigned To</p>
                  <p className="font-medium text-slate-900">
                    {selectedTicket.assignedAgent || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <p className="font-medium text-slate-900">{selectedTicket.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Messages</p>
                  <p className="font-medium text-slate-900">{selectedTicket.messages}</p>
                </div>
              </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-900 mb-4">Reply / Comment</h4>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Type your reply here..."
                ></textarea>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">📎</button>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">😊</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                      Save as Draft
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <select className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
                <option>Assign to agent...</option>
                <option>Sarah Admin</option>
                <option>Mike Support</option>
                <option>Jessica Help</option>
              </select>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                Change Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
