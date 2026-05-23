const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create workspace',
      description: 'Sign up and create your secure workspace in seconds.'
    },
    {
      number: '02',
      title: 'Organize notes/tasks',
      description: 'Start adding your notes, tasks, and organize your workflow.'
    },
    {
      number: '03',
      title: 'Collaborate securely',
      description: 'Invite your team and collaborate in real-time with complete security.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get started in 3 simple steps
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            It only takes a minute to start organizing your life with SecureFlow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-7xl font-bold text-slate-100 mb-4">{step.number}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
