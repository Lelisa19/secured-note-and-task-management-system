const WorkspaceBillingPage = () => {
  const billingHistory: { id: number; date: string; amount: string; status: string; invoice: string }[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Billing</h1>
          <p className="text-slate-600">Manage your workspace subscription and billing.</p>
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          onClick={() => { alert('Upgrade not yet wired in the backend.'); }}
        >
          Upgrade Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">No Active Plan</h3>
            <p className="text-slate-500">Subscribe to start using workspace billing features.</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">Inactive</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-600 mb-1">Team Members</div>
            <div className="text-2xl font-bold text-slate-900">—</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-600 mb-1">Next Renewal</div>
            <div className="text-2xl font-bold text-slate-900">—</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="text-sm text-slate-600 mb-1">Storage Used</div>
            <div className="text-2xl font-bold text-slate-900">—</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            onClick={() => { alert('Payment method flow not yet wired in the backend.'); }}
          >
            Change Payment Method
          </button>
          <button
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            disabled
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Billing History</h3>
        </div>
        {billingHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No workspace billing history yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Invoice</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {billingHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.invoice}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.amount}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-sm text-indigo-600 font-medium hover:underline"
                        onClick={() => { alert('Invoice download not yet wired in the backend.'); }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceBillingPage;
