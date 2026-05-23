const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      text: 'SecureFlow has completely transformed how our team organizes and collaborates. The security features give us complete peace of mind.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'StartupX',
      text: 'Finally a productivity tool that takes security seriously. End-to-end encryption is a game-changer for our sensitive data.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      company: 'DesignStudio',
      text: 'Beautiful interface, powerful features, and rock-solid security. Our team loves using SecureFlow every single day.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See what our customers have to say about SecureFlow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100">
              <div className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-500 text-sm">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
