import { useState } from 'react';

interface Transaction {
  id: string;
  user: {
    name: string;
    email: string;
  };
  amount: string;
  currency: string;
  status: 'paid' | 'failed' | 'pending';
  type: 'subscription' | 'one-time' | 'refund';
  plan: string;
  date: string;
  invoiceId: string;
}

interface RevenueStat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: string;
  isPositive: boolean;
}

const PaymentsPage = () => {
  const [transactions] = useState<Transaction[]>([
    { id: 'txn_001', user: { name: 'John Doe', email: 'john@example.com' }, amount: '$99.00', currency: 'USD', status: 'paid', type: 'subscription', plan: 'Business', date: 'Jan 20, 2024', invoiceId: 'INV-2024-001' },
    { id: 'txn_002', user: { name: 'Sarah Miller', email: 'sarah@example.com' }, amount: '$49.00', currency: 'USD', status: 'paid', type: 'subscription', plan: 'Pro', date: 'Jan 19, 2024', invoiceId: 'INV-2024-002' },
    { id: 'txn_003', user: { name: 'Mike Johnson', email: 'mike@example.com' }, amount: '$29.00', currency: 'USD', status: 'failed', type: 'subscription', plan: 'Pro', date: 'Jan 18, 2024', invoiceId: 'INV-2024-003' },
    { id: 'txn_004', user: { name: 'Emily Davis', email: 'emily@example.com' }, amount: '$199.00', currency: 'USD', status: 'paid', type: 'subscription', plan: 'Enterprise', date: 'Jan 17, 2024', invoiceId: 'INV-2024-004' },
    { id: 'txn_005', user: { name: 'David Wilson', email: 'david@example.com' }, amount: '-$49.00', currency: 'USD', status: 'paid', type: 'refund', plan: 'Pro', date: 'Jan 16, 2024', invoiceId: 'INV-2024-005' },
    { id: 'txn_006', user: { name: 'Jessica Brown', email: 'jessica@example.com' }, amount: '$99.00', currency: 'USD', status: 'pending', type: 'subscription', plan: 'Business', date: 'Jan 15, 2024', invoiceId: 'INV-2024-006' },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');

  const revenueStats: RevenueStat[] = [
    { label: 'Total Revenue', value: '$118,450', change: '+12.5%', color: 'from-emerald-500 to-emerald-600', icon: '💰', isPositive: true },
    { label: 'This Month', value: '$28,450', change: '+8.2%', color: 'from-blue-500 to-blue-600', icon: '📅', isPositive: true },
    { label: 'Pending', value: '$1,250', change: '-2.1%', color: 'from-amber-500 to-amber-600', icon: '⏳', isPositive: false },
    { label: 'Refunds', value: '$3,210', change: '+5.4%', color: 'from-red-500 to-red-600', icon: '↩️', isPositive: false },
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         txn.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || txn.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || txn.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Transactions</h1>
          <p className="text-slate-600">Manage all payments and financial transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span>📄</span>
            Export CSV
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <span>📊</span>
            Financial Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
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
                  placeholder="Search transactions..."
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
                <option>Paid</option>
                <option>Failed</option>
                <option>Pending</option>
              </select>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>All Types</option>
                <option>Subscription</option>
                <option>One-time</option>
                <option>Refund</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Transaction</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        txn.type === 'refund' ? 'bg-red-100 text-red-600' : 
                        txn.type === 'subscription' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {txn.type === 'refund' ? '↩️' : txn.type === 'subscription' ? '📦' : '💳'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{txn.invoiceId}</p>
                        <p className="text-xs text-slate-500">{txn.plan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{txn.user.name}</p>
                      <p className="text-xs text-slate-500">{txn.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${txn.type === 'refund' ? 'text-red-600' : 'text-slate-900'}`}>
                      {txn.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${
                      txn.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      txn.status === 'failed' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        txn.status === 'paid' ? 'bg-emerald-500' : 
                        txn.status === 'failed' ? 'bg-red-500' : 
                        'bg-amber-500'
                      }`}></div>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 capitalize">{txn.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{txn.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedInvoice(txn)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        👁️
                      </button>
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                        📄
                      </button>
                      {txn.status === 'paid' && txn.type !== 'refund' && (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          ↩️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                <p className="text-slate-500 text-sm">{selectedInvoice.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-2">Customer</h4>
                  <p className="font-medium text-slate-900">{selectedInvoice.user.name}</p>
                  <p className="text-sm text-slate-600">{selectedInvoice.user.email}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-semibold text-slate-500 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                    selectedInvoice.status === 'failed' ? 'bg-red-100 text-red-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-700">Plan</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.plan}</span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-700">Type</span>
                  <span className="font-medium text-slate-900 capitalize">{selectedInvoice.type}</span>
                </div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-700">Date</span>
                  <span className="font-medium text-slate-900">{selectedInvoice.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className={`text-xl font-bold ${selectedInvoice.type === 'refund' ? 'text-red-600' : 'text-slate-900'}`}>
                    {selectedInvoice.amount}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  Download PDF
                </button>
                {selectedInvoice.status === 'paid' && selectedInvoice.type !== 'refund' && (
                  <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors">
                    Issue Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
