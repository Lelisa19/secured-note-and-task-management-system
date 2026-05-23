const Security = () => {
  const securityFeatures = [
    {
      icon: '🛡️',
      title: 'End-to-end encryption',
      description: 'Your data is encrypted before it leaves your device.'
    },
    {
      icon: '🔐',
      title: 'Two-factor authentication',
      description: 'Add an extra layer of security to your account.'
    },
    {
      icon: '🏰',
      title: 'Secure cloud architecture',
      description: 'Built on enterprise-grade infrastructure with zero-trust.'
    },
    {
      icon: '🔒',
      title: 'Privacy-first messaging',
      description: 'All communications are encrypted and never stored.'
    }
  ];

  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Security you can trust
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your data is your most valuable asset. We protect it like it's our own.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-all">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
