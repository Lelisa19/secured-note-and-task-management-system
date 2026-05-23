const Features = () => {
  const features = [
    {
      icon: '🔒',
      title: 'Encrypted Notes',
      description: 'End-to-end encryption for all your notes. Only you can access your content.'
    },
    {
      icon: '✅',
      title: 'Smart Tasks',
      description: 'AI-powered task management with smart reminders and priority sorting.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Work together securely with real-time collaboration and role-based access.'
    },
    {
      icon: '☁️',
      title: 'Secure Cloud Sync',
      description: 'Seamless sync across all devices with military-grade security.'
    },
    {
      icon: '📊',
      title: 'Productivity Analytics',
      description: 'Track your progress with beautiful dashboards and insights.'
    },
    {
      icon: '⚡',
      title: 'Real-Time Workspace',
      description: 'Live updates and instant notifications for your entire team.'
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything you need to stay productive
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to help you organize, collaborate, and create with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all transform hover:-translate-y-1 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
