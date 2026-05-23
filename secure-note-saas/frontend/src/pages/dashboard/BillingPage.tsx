const BillingPage = () => {
  const billingHistory = [
    { id: 1, date: 'May 1, 2025', amount: '$29.00', status: 'Paid', invoice: '#INV-00123' },
    { id: 2, date: 'April 1, 2025', amount: '$29.00', status: 'Paid', invoice: '#INV-00122' },
    { id: 3, date: 'March 1, 2025', amount: '$29.00', status: 'Paid', invoice: '#INV-00121' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
        <p className="text-slate-600">Manage your subscription and billing information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Current Plan</h3>
                <p className="text-sm text-slate-600">Pro Plan</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
                Upgrade Plan
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900">$29</div>
                <div className="text-sm text-slate-600">per month</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900">5</div>
                <div className="text-sm text-slate-600">Team members</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900">Active</div>
                <div className="text-sm text-slate-600">Subscription</div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 mb-3">Payment Method</h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded"></div>
                <span className="text-sm text-slate-900">•••• •••• •••• 4242</span>
              </div>
              <button className="text-sm text-indigo-600 font-medium hover:underline">Change</button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Invoice</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-3 text-slate-900">{item.date}</td>
                      <td className="py-3 text-slate-600">{item.invoice}</td>
                      <td className="py-3 font-medium text-slate-900">{item.amount}</td>
                      <td className="py-3">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{item.status}</span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-sm text-indigo-600 font-medium hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
