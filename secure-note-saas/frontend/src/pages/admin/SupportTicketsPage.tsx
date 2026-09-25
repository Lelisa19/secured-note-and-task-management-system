import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface TicketUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: TicketUser;
}

interface Ticket {
  id: string;
  subject: string;
  user: { name: string; email: string };
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  priorityLabel: string;
  assignedAgent: string | null;
  createdAt: string;
  lastUpdated: string;
  category: string;
  messages: number;
  slaStatus: 'ok' | 'warning' | 'overdue';
  message: string;
}

const fmtAgo = (d: string) => {
  try {
    const diff = Date.now() - new Date(d).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return d;
  }
};

const mapPriority = (p: string): { priority: 'low' | 'medium' | 'high' | 'urgent'; label: string; } => {
  const up = (p || 'MEDIUM').toUpperCase();
  if (up === 'URGENT') return { priority: 'urgent', label: 'Urgent' };
  if (up === 'HIGH') return { priority: 'high', label: 'High' };
  if (up === 'LOW') return { priority: 'low', label: 'Low' };
  return { priority: 'medium', label: 'Medium' };
};

const mapStatus = (s: string) => {
  const up = (s || 'OPEN').toUpperCase();
  if (up === 'RESOLVED') return 'resolved';
  if (up === 'PENDING') return 'pending';
  if (up === 'CLOSED') return 'closed';
  return 'open';
};

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const raw: AdminTicket[] = (await apiRequest('/admin/tickets')) || [];
      const mapped: Ticket[] = raw.map((t) => {
        const { priority, label } = mapPriority(t.priority);
        const ageHrs = Math.max(0, Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 3600000));
        const slaStatus: 'ok' | 'warning' | 'overdue' =
          priority === 'urgent' ? (ageHrs > 4 ? 'overdue' : ageHrs > 2 ? 'warning' : 'ok') :
          priority === 'high' ? (ageHrs > 12 ? 'overdue' : ageHrs > 6 ? 'warning' : 'ok') :
          priority === 'medium' ? (ageHrs > 48 ? 'overdue' : ageHrs > 24 ? 'warning' : 'ok') :
          (ageHrs > 96 ? 'overdue' : ageHrs > 48 ? 'warning' : 'ok');
        return {
          id: t.id,
          subject: t.subject,
          user: { name: t.user.fullName, email: t.user.email },
          status: mapStatus(t.status),
          priority,
          priorityLabel: label,
          assignedAgent: null,
          createdAt: fmtAgo(t.createdAt),
          lastUpdated: fmtAgo(t.updatedAt),
          category: 'General',
          messages: 1,
          slaStatus,
          message: t.message,
        };
      });
      setTickets(mapped);
    } catch (e: any) {
      setError(e?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ticket.status === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All Priorities' || ticket.priorityLabel.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalOpen = filteredTickets.filter(t => t.status === 'open').length;
  const totalPending = filteredTickets.filter(t => t.status === 'pending').length;
  const totalResolved = filteredTickets.filter(t => t.status === 'resolved').length;
  const totalUrgent = filteredTickets.filter(t => t.priority === 'urgent').length;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-600">Manage all customer support tickets</p>
        </div>
        <button onClick={load} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/25">
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Open</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📭</div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalOpen}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Pending</span>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">⏳</div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalPending}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Resolved</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">✅</div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalResolved}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Urgent</span>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">🔥</div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalUrgent}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Status</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl w-fit">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}>📋 List</button>
            <button onClick={() => setViewMode('board')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'board' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}>🗂️ Board</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">Loading tickets…</div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
          {tickets.length === 0 ? 'No support tickets yet.' : 'No tickets match your filters.'}
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-medium">{ticket.id.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedTicket(ticket)} className="font-medium text-slate-900 hover:text-indigo-600 text-left truncate max-w-xs block">{ticket.subject}</button>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{ticket.category}</span>
                        <span className="text-xs text-slate-400">💬 {ticket.messages}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">{getInitials(ticket.user.name)}</div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 text-sm truncate">{ticket.user.name}</div>
                          <div className="text-xs text-slate-500 truncate">{ticket.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 animate-pulse' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{ticket.priorityLabel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                        ticket.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {typeof ticket.status === 'string' ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {ticket.assignedAgent.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-900">{ticket.assignedAgent}</span>
                        </div>
                      ) : (
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 whitespace-nowrap">Assign →</button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        ticket.slaStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                        ticket.slaStatus === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.slaStatus.charAt(0).toUpperCase() + ticket.slaStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{ticket.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedTicket(ticket)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Open', 'Pending', 'Resolved'].map(statusCol => (
            <div key={statusCol} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{statusCol}</h3>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-bold">
                  {filteredTickets.filter(t => t.status === statusCol.toLowerCase()).length}
                </span>
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {filteredTickets.filter(t => t.status === statusCol.toLowerCase()).map(ticket => (
                  <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="bg-slate-50 rounded-xl p-4 hover:shadow-md cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-xs text-indigo-600">{ticket.id.toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{ticket.priorityLabel}</span>
                    </div>
                    <h4 className="font-medium text-slate-900 mb-2 line-clamp-2">{ticket.subject}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {getInitials(ticket.user.name)}
                      </div>
                      <span className="truncate">{ticket.user.name}</span>
                      <span>·</span>
                      <span>{ticket.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedTicket(null); setReplyText(''); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 sticky top-0 bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm text-indigo-600">{selectedTicket.id.toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    selectedTicket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{selectedTicket.priorityLabel}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTicket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                    selectedTicket.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {typeof selectedTicket.status === 'string' ? selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1) : selectedTicket.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2>
              </div>
              <button onClick={() => { setSelectedTicket(null); setReplyText(''); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg flex-shrink-0">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(selectedTicket.user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{selectedTicket.user.name}</p>
                    <p className="text-xs text-slate-500">{selectedTicket.createdAt}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{selectedTicket.message || 'No message provided.'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Write a reply</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the user..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 min-w-[140px] px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Save as Draft</button>
                <button
                  onClick={() => { alert('Reply queue not yet wired in backend — save feature coming soon!'); setReplyText(''); }}
                  className="flex-1 min-w-[140px] px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/25"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
