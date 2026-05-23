const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <span className="mr-2">🔒</span>
            100% Secure & Private
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Secure your notes, tasks, and ideas in one private workspace.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Manage notes, tasks, reminders, and collaboration securely with modern productivity tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="text-slate-700 px-8 py-4 rounded-full text-lg font-semibold border border-slate-300 hover:bg-slate-100 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">10K+</div>
            <div className="text-slate-600 mt-2">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">99.9%</div>
            <div className="text-slate-600 mt-2">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">256-bit</div>
            <div className="text-slate-600 mt-2">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">24/7</div>
            <div className="text-slate-600 mt-2">Support</div>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm mb-6">Trusted by teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Acme Corp', 'TechStart', 'DesignCo', 'DataFlow', 'CloudSync'].map((company, idx) => (
              <span key={idx} className="text-slate-700 font-semibold text-lg">{company}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
