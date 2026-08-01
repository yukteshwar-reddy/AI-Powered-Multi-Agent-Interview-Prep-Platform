import { useNavigate } from 'react-router-dom';
import { LucideArrowRight, LucideBot, LucideTarget, LucideTrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          Ace your next interview with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Nexus AI</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Upload your resume, specify your target role, and experience a realistic, multi-agent AI mock interview with personalized feedback.
        </p>
        <button 
          onClick={() => navigate('/setup')}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          Get Started
          <LucideArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            title: "Tailored to You",
            desc: "We analyze your resume and target job description to generate highly relevant questions.",
            icon: <LucideTarget className="w-8 h-8 text-indigo-400" />
          },
          {
            title: "Multi-Agent Evaluation",
            desc: "Your answers are reviewed by specialized agents focusing on technical accuracy, communication, and confidence.",
            icon: <LucideBot className="w-8 h-8 text-purple-400" />
          },
          {
            title: "Actionable Feedback",
            desc: "Receive a detailed breakdown of your strengths, weaknesses, and a personalized study plan.",
            icon: <LucideTrendingUp className="w-8 h-8 text-emerald-400" />
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
