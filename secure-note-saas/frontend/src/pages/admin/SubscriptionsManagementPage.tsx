import { useState } from 'react';

interface Subscription {
  id: string;
  user: {
    name: string;
    email: string;
  };
  plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  price: string;
  interval: 'monthly' | 'yearly';
  startDate: string;
  nextBilling: string;
  lastPayment: string;
}

interface SubscriptionStat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
  isPositive: boolean;
}

const SubscriptionsManagementPage = () => {
  const [subscriptions] = useState<Subscription[]>([
    { id: 'sub_001', user: { name: 'John Doe', email: 'john@example.com' }, plan: 'Enterprise', status: 'active', price: '$199/mo', interval: 'monthly', startDate: 'Jan 15, 2024', nextBilling: 'Feb 15, 2024', lastPayment: 'Jan 15, 2024' },
    { id: 'sub_002', user: { name: 'Sarah Miller', email: 'sarah@example.com' }, plan: 'Pro', status: 'active', price: '$49/mo', interval: 'monthly', startDate: 'Feb 20, 2024', nextBilling: 'Mar 20, 2024', lastPayment: 'Feb 20, 2024' },
    { id: 'sub_003', user: { name: 'Mike Johnson', email: 'mike@example.com' }, plan: 'Pro', status: 'past_due', price: '$49/mo', interval: 'monthly', startDate: 'Mar 10, 2024', nextBilling: 'Apr 10, 2024', lastPayment: 'Mar 10, 2024' },
    { id: 'sub_004', user: { name: 'Emily Davis', email: 'emily@example.com' }, plan: 'Business', status: 'active', price: '$99/mo', interval: 'monthly', startDate: 'Apr 05, 2024', nextBilling: 'May 05, 2024', lastPayment: 'Apr 05, 2024' },
    { id: 'sub_005', user: { name: 'David Wilson', email: 'david@example.com' }, plan: 'Free', status: 'active', price: '$0/mo', interval: 'monthly', startDate: 'May 12, 2024', nextBilling: '—', lastPayment: '—' },
    { id: 'sub_006', user: { name: 'Jessica Brown', email: 'jessica@example.com' }, plan: 'Enterprise', status: 'cancelled', price: '$199/mo', interval: 'monthly', startDate: 'Jun 01, 2024', nextBilling: '—', lastPayment: 'Jun 01, 2024' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All Plans');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  const subscriptionStats: SubscriptionStat[] = [
    { label: 'Active Subscriptions', value: '2,156', change: '+89', color: 'from-emerald-500 to-emerald-600', icon: '✅', isPositive: true },
    { label: 'Monthly Recurring Revenue', value: '$84,520', change: '+12.5%', color: 'from-blue-500 to-blue-600', icon: '💰', isPositive: true },
    { label: 'New This Month', value: '124', change: '+24', color: 'from-purple-500 to-purple-600', icon: '🎉', isPositive: true },
    { label: 'Cancelled', value: '42', change: '-8', color: 'from-amber-500 to-amber-600', icon: '🚫', isPositive: false },
  ];

  const planDistribution = [
    { name: 'Enterprise', percentage: 20, count: '431', color: 'bg-purple-500', revenue: '$42,869' },
    { name: 'Business', percentage: 30, count: '647', revenue: '$32,053' },
    { name: 'Pro', percentage: 40, count: '862', revenue: '$21,138' },
    { name: 'Free', percentage: 10, count: '216', revenue: '$0' },
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         sub.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'All Plans' || sub.plan === planFilter;
    const matchesStatus = statusFilter === 'All Status' || sub.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'past_due': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'trialing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'past_due': return 'bg-amber-500';
      case 'cancelled': return 'bg-red-500';
      case 'trialing': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-100 text-purple-700';
      case 'Business': return 'bg-blue-100 text-blue-700';
      case 'Pro': return 'bg-indigo-100 text-indigo-700';
      case 'Free': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions Management</h1>
          <p className="text-slate-600">Manage all subscriptions across the platform</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>📄</span>
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <span>📊</span>
            View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${stat.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Plan Distribution</h3>
              <p className="text-sm text-slate-500">Subscription breakdown by plan</p>
            </div>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
            <div className="text-center text-slate-500">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-lg font-medium text-slate-700">Plan Distribution Chart</p>
              <p className="text-sm text-slate-500">Charts would render here with Recharts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {planDistribution.map((plan, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    plan.name === 'Enterprise' ? 'bg-purple-500' :
                    plan.name === 'Business' ? 'bg-blue-500' :
                    plan.name === 'Pro' ? 'bg-indigo-500' :
                    'bg-slate-400'
                  }`}></div>
                  <span className="font-medium text-slate-900">{plan.name}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{plan.count}</p>
                <p className="text-xs text-slate-500">subscriptions</p>
                {plan.revenue !== '$0' && (
                  <p className="text-sm font-semibold text-emerald-600 mt-1">{plan.revenue}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { name: 'View All Active', icon: '✅', description: 'Active subscriptions' },
              { name: 'Past Due Invoices', icon: '⏳', description: 'Need attention' },
              { name: 'Cancelled Today', icon: '🚫', description: 'Recent churn' },
              { name: 'Trial Ending Soon', icon: '⏰', description: 'Convert trials' },
            ].map((action, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-3 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-colors text-left"
              >
                <span className="text-xl">{action.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{action.name}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">Revenue by Plan</h4>
            <div className="space-y-4">
              {planDistribution.map((plan, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{plan.revenue}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        plan.name === 'Enterprise' ? 'bg-purple-500' :
                        plan.name === 'Business' ? 'bg-blue-500' :
                        plan.name === 'Pro' ? 'bg-indigo-500' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${plan.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
                <span className="text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-slate-700"
                />
              </div>
              <select 
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Plans</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Business</option>
                <option>Enterprise</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Past Due</option>
                <option>Cancelled</option>
                <option>Trialing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Plan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Start Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Next Billing</th>
                <th className="text-left px-6 px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {sub.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{sub.user.name}</p>
                        <p className="text-xs text-slate-500">{sub.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadgeClass(sub.plan)}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusBadgeClass(sub.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(sub.status)}`}></div>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{sub.price}</p>
                      <p className="text-xs text-slate-500">{sub.interval}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sub.startDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{sub.nextBilling}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        👁️
                      </button>
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        📈
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsManagementPage;
