import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is my data really encrypted?',
      answer: 'Yes! All your data is end-to-end encrypted. Only you have access to your encryption keys.'
    },
    {
      question: 'Can I use SecureFlow on multiple devices?',
      answer: 'Absolutely! SecureFlow syncs seamlessly across all your devices - desktop, mobile, and tablet.'
    },
    {
      question: 'How secure is the cloud storage?',
      answer: 'We use military-grade AES-256 encryption and our servers are located in secure data centers with 24/7 monitoring.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.'
    },
    {
      question: 'Do you offer custom enterprise plans?',
      answer: 'Yes! We offer custom enterprise plans with dedicated support, SLA guarantees, and custom security requirements.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-slate-600">
            Got questions? We've got answers.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                <span className="text-2xl transition-transform">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
