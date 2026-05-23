const SubscriptionPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['Unlimited notes', 'Basic tasks', '1 team member', 'Email support'],
      current: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      features: ['Everything in Free', 'Advanced analytics', '5 team members', 'Priority support', 'Custom domains'],
      current: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      features: ['Everything in Pro', 'Unlimited team members', 'SSO & advanced security', 'Dedicated account manager', 'Custom integrations'],
      current: false,
    },
  ];

  const usageStats = [
    { label: 'Notes Created', used: '128', limit: 'Unlimited' },
    { label: 'Team Members', used: '3', limit: '5' },
    { label: 'Storage Used', used: '2.3 GB', limit: '10 GB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscription</h1>
        <p className="text-slate-600">Manage your subscription and upgrade your plan.</p>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {usageStats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-slate-900">
                {stat.used} <span className="text-sm font-normal text-slate-500">/ {stat.limit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renewal Date & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-slate-600 mb-1">Next Renewal Date</div>
            <div className="text-xl font-bold text-slate-900">June 1, 2025</div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              Change Payment Method
            </button>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div key={idx} className={`bg-white rounded-2xl border-2 p-6 ${plan.current ? 'border-indigo-500 shadow-xl' : 'border-slate-200 shadow-sm'}`}>
            {plan.current && <div className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full inline-block mb-4">Current Plan</div>}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-slate-600 ml-1">/{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-sm text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-2 rounded-xl font-medium transition-all ${
              plan.current 
                ? 'bg-slate-100 text-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-emerald-500 text-white hover:shadow-lg'
            }`}>
              {plan.current ? 'Current Plan' : plan.price === '$0' ? 'Downgrade' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
