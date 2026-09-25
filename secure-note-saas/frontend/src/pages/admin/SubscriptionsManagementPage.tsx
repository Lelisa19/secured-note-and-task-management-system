import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface SubUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminSubscription {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: SubUser;
}

interface SubscriptionStat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
  isPositive: boolean;
}

const fmtDate = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
};

const planPrice = (plan: string) => {
  switch (plan) {
    case 'ENTERPRISE': return '$199/mo';
    case 'BUSINESS': return '$99/mo';
    case 'PRO': return '$49/mo';
    default: return '$0/mo';
  }
};

const SubscriptionsManagementPage = () => {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All Plans');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest('/admin/subscriptions');
      setSubscriptions(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const active = subscriptions.filter((s) => s.isActive).length;
  const totalMonthly = subscriptions.reduce((sum, s) => {
    if (!s.isActive) return sum;
    if (s.plan === 'ENTERPRISE') return sum + 199;
    if (s.plan === 'BUSINESS') return sum + 99;
    if (s.plan === 'PRO') return sum + 49;
    return sum;
  }, 0);
  const newThisMonth = subscriptions.filter((s) => {
    const start = new Date(s.startDate);
    const now = new Date();
    return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
  }).length;
  const cancelled = subscriptions.filter((s) => !s.isActive).length;

  const subscriptionStats: SubscriptionStat[] = [
    { label: 'Active Subscriptions', value: active.toLocaleString(), change: `+${newThisMonth}`, color: 'from-emerald-500 to-emerald-600', icon: '✅', isPositive: true },
    { label: 'Monthly Recurring Revenue', value: `$${totalMonthly.toLocaleString()}`, change: `+$${totalMonthly}`, color: 'from-blue-500 to-blue-600', icon: '💰', isPositive: true },
    { label: 'New This Month', value: newThisMonth.toLocaleString(), change: `+${newThisMonth}`, color: 'from-purple-500 to-purple-600', icon: '🎉', isPositive: true },
    { label: 'Inactive', value: cancelled.toLocaleString(), change: `-${cancelled}`, color: 'from-amber-500 to-amber-600', icon: '🚫', isPositive: false },
  ];

  const totalCount = subscriptions.length || 1;
  const planDistribution = [
    { name: 'Enterprise', count: subscriptions.filter((s) => s.plan === 'ENTERPRISE').length, revenue: `$${subscriptions.filter((s) => s.plan === 'ENTERPRISE' && s.isActive).length * 199}` },
    { name: 'Business', count: subscriptions.filter((s) => s.plan === 'BUSINESS').length, revenue: `$${subscriptions.filter((s) => s.plan === 'BUSINESS' && s.isActive).length * 99}` },
    { name: 'Pro', count: subscriptions.filter((s) => s.plan === 'PRO').length, revenue: `$${subscriptions.filter((s) => s.plan === 'PRO' && s.isActive).length * 49}` },
    { name: 'Free', count: subscriptions.filter((s) => s.plan === 'FREE').length, revenue: '$0' },
  ].map((p) => ({
    ...p,
    percentage: Math.round((p.count / totalCount) * 100),
    color: p.name === 'Enterprise' ? 'bg-purple-500' : p.name === 'Business' ? 'bg-indigo-500' : p.name === 'Pro' ? 'bg-emerald-500' : 'bg-slate-500',
  }));

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'All Plans' ||
      sub.plan.toUpperCase() === planFilter.toUpperCase().replace(' ', '');
    const matchesStatus = statusFilter === 'All Status' ||
      (statusFilter === 'active' && sub.isActive) ||
      (statusFilter === 'cancelled' && !sub.isActive);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions Management</h1>
          <p className="text-slate-600">Manage all user subscriptions and billing</p>
        </div>
        <button onClick={load} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50">
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>{stat.icon}</div>
              <span className={`text-sm font-medium px-2 py-1 rounded-lg ${stat.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>{stat.change}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-slate-700"
              />
            </div>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Plans</option>
              <option>Free</option>
              <option>Pro</option>
              <option>Business</option>
              <option>Enterprise</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            {planDistribution.map((plan, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{plan.name}</span>
                  <span className="text-slate-500">{plan.count} · {plan.revenue}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className={`${plan.color} h-2 rounded-full`} style={{ width: `${plan.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading subscriptions…</div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No subscriptions match your search.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Billing</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscriptions.map((sub) => {
                const nextBilling = sub.isActive && sub.startDate
                  ? (() => {
                      const d = new Date(sub.startDate);
                      d.setMonth(d.getMonth() + 1);
                      return fmtDate(d.toISOString());
                    })()
                  : '—';
                const displayStatus = sub.isActive ? 'active' : 'cancelled';
                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(sub.user.fullName)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{sub.user.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{sub.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sub.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                        sub.plan === 'BUSINESS' ? 'bg-indigo-100 text-indigo-700' :
                        sub.plan === 'PRO' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        displayStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{planPrice(sub.plan)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{fmtDate(sub.startDate)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{nextBilling}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsManagementPage;
