import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface PaymentUser {
  id: string;
  fullName: string;
  email: string;
}

interface AdminPayment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string | null;
  transactionId?: string | null;
  createdAt: string;
  user: PaymentUser;
}

interface Transaction {
  id: string;
  user: { name: string; email: string };
  amount: string;
  currency: string;
  status: 'paid' | 'failed' | 'pending' | string;
  type: 'subscription' | 'refund' | 'one-time' | string;
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

const fmtDate = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
};

const PaymentsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const raw: AdminPayment[] = (await apiRequest('/admin/payments')) || [];
      const mapped: Transaction[] = raw.map((p) => ({
        id: p.id,
        user: { name: p.user.fullName, email: p.user.email },
        amount: `${p.amount < 0 ? '-' : ''}$${Math.abs(p.amount).toFixed(2)}`,
        currency: p.currency || 'USD',
        status: (p.status || '').toLowerCase() === 'succeeded' || (p.status || '').toLowerCase() === 'completed'
          ? 'paid'
          : (p.status || 'pending').toLowerCase(),
        type: p.amount < 0 ? 'refund' : 'subscription',
        plan: '—',
        date: fmtDate(p.createdAt),
        invoiceId: p.transactionId || `INV-${p.id.slice(-6).toUpperCase()}`,
      }));
      setTransactions(mapped);
    } catch (e: any) {
      setError(e?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const parseAmt = (a: string) => parseFloat(a.replace(/[^\d.-]/g, '')) || 0;

  const totalRevenue = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + parseAmt(t.amount), 0);

  const now = new Date();
  const thisMonthRevenue = transactions
    .filter((t) => {
      if (t.status !== 'paid') return false;
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + parseAmt(t.amount), 0);

  const pendingAmt = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(parseAmt(t.amount)), 0);

  const refundAmt = transactions
    .filter((t) => t.type === 'refund')
    .reduce((sum, t) => sum + Math.abs(parseAmt(t.amount)), 0);

  const revenueStats: RevenueStat[] = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+0%', color: 'from-emerald-500 to-emerald-600', icon: '💰', isPositive: true },
    { label: 'This Month', value: `$${thisMonthRevenue.toFixed(2)}`, change: '+0%', color: 'from-blue-500 to-blue-600', icon: '📅', isPositive: true },
    { label: 'Pending', value: `$${pendingAmt.toFixed(2)}`, change: '-0%', color: 'from-amber-500 to-amber-600', icon: '⏳', isPositive: false },
    { label: 'Refunds', value: `$${refundAmt.toFixed(2)}`, change: '+0%', color: 'from-red-500 to-red-600', icon: '↩️', isPositive: false },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || txn.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All Types' || txn.type === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Billing</h1>
          <p className="text-slate-600">Track all platform transactions and revenue</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">📊 Export CSV</button>
          <button onClick={load} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/25">
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, idx) => (
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
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
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
              <option>All Types</option>
              <option value="Subscription">Subscription</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading payments…</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No payments found — you haven't recorded any yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-indigo-600 font-medium">{txn.invoiceId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(txn.user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{txn.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{txn.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{txn.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      txn.type === 'refund' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{txn.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(txn)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-slate-500">Invoice ID</dt><dd className="font-mono font-medium text-slate-900">{selectedInvoice.invoiceId}</dd></div>
                <div><dt className="text-slate-500">Date</dt><dd className="font-medium text-slate-900">{selectedInvoice.date}</dd></div>
                <div><dt className="text-slate-500">Customer</dt><dd className="font-medium text-slate-900">{selectedInvoice.user.name}</dd></div>
                <div><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{selectedInvoice.user.email}</dd></div>
                <div><dt className="text-slate-500">Plan</dt><dd className="font-medium text-slate-900">{selectedInvoice.plan}</dd></div>
                <div><dt className="text-slate-500">Status</dt><dd className="font-medium text-slate-900 capitalize">{selectedInvoice.status}</dd></div>
                <div className="col-span-2"><dt className="text-slate-500">Total Amount</dt><dd className="font-bold text-xl text-slate-900">{selectedInvoice.amount}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
