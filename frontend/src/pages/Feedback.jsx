import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFeedback } from '../api/api';
import { LucideTrophy, LucideTrendingUp, LucideAlertTriangle, LucideBookOpen } from 'lucide-react';

export default function Feedback() {
  const { interviewId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getFeedback(interviewId);
        setData(res);
      } catch (err) {
        setError("Failed to generate feedback. Ensure all questions were answered.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl text-gray-400">Generating your comprehensive report...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-center text-red-400 py-20">{error}</div>;
  }

  const { feedback, study_plan } = data;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header / Score */}
      <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <LucideTrophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h1 className="text-4xl font-bold mb-2">Interview Complete</h1>
        <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 my-6">
          {feedback.overall_score} <span className="text-2xl text-gray-500">/ 10</span>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          You've completed the multi-agent evaluation. Review your personalized feedback and study plan below to prepare for the real thing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="glass-panel p-6 rounded-3xl border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-3 mb-6">
            <LucideTrendingUp className="text-emerald-500 w-6 h-6" />
            <h2 className="text-2xl font-bold">Strengths</h2>
          </div>
          <ul className="space-y-3">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel p-6 rounded-3xl border-t-4 border-t-red-500">
          <div className="flex items-center gap-3 mb-6">
            <LucideAlertTriangle className="text-red-500 w-6 h-6" />
            <h2 className="text-2xl font-bold">Areas to Improve</h2>
          </div>
          <ul className="space-y-3">
            {feedback.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-3 text-gray-300">
                <span className="text-red-500 mt-1">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Study Plan */}
      <div className="glass-panel p-8 rounded-3xl border-t-4 border-t-indigo-500">
        <div className="flex items-center gap-3 mb-8">
          <LucideBookOpen className="text-indigo-400 w-8 h-8" />
          <h2 className="text-3xl font-bold">Your Action Plan</h2>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Weak Skills to Focus On</h3>
            <div className="flex flex-wrap gap-3">
              {study_plan.weak_skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Recommended Resources</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {study_plan.resources.map((res, i) => (
                <li key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 text-gray-300">
                  {res}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Study Strategy</h3>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {study_plan.plan}
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Problem Breakdown */}
      {data.questions && data.questions.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <LucideBookOpen className="text-indigo-400 w-8 h-8" />
            <h2 className="text-3xl font-bold">Detailed Problem Breakdown</h2>
          </div>
          {data.questions.map((q, i) => {
            const scoreData = data.scores && data.scores[i];
            if (!scoreData) return null;
            return (
              <div key={i} className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold text-indigo-400 mb-3">Problem {i + 1}</h3>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">{q}</p>
                
                <div className="bg-black/30 p-5 rounded-2xl mb-8 border border-white/5">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Answer</h4>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{data.answers[i] || "No answer provided."}</p>
                </div>

                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Multi-Agent Evaluation</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-bold text-indigo-300">Technical Accuracy</h5>
                      <span className="bg-indigo-500/30 px-3 py-1 rounded-full text-sm font-bold text-indigo-200">{scoreData.technical_score}/10</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{scoreData.technical_feedback}</p>
                  </div>
                  
                  <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-bold text-emerald-300">Problem Solving</h5>
                      <span className="bg-emerald-500/30 px-3 py-1 rounded-full text-sm font-bold text-emerald-200">{scoreData.problem_solving_score}/10</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{scoreData.problem_solving_feedback}</p>
                  </div>
                  
                  <div className="bg-purple-500/10 p-5 rounded-2xl border border-purple-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-bold text-purple-300">Communication</h5>
                      <span className="bg-purple-500/30 px-3 py-1 rounded-full text-sm font-bold text-purple-200">{scoreData.communication_score}/10</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{scoreData.communication_feedback}</p>
                  </div>
                  
                  <div className="bg-pink-500/10 p-5 rounded-2xl border border-pink-500/20">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-bold text-pink-300">Confidence & Detail</h5>
                      <span className="bg-pink-500/30 px-3 py-1 rounded-full text-sm font-bold text-pink-200">{Math.round((scoreData.confidence_score + scoreData.detail_score)/2)}/10</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{scoreData.detail_feedback}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
