import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl mb-10 opacity-90">
          Join thousands of teams who trust SecureFlow for their productivity and security needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="w-full sm:w-auto text-center bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start Free Trial
          </Link>
          <button className="w-full sm:w-auto text-center border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
