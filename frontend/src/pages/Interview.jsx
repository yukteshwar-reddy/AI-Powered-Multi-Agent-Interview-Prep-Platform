import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { submitAnswer } from '../api/api';
import { LucideSend, LucideLoader2 } from 'lucide-react';

export default function Interview() {
  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (questions.length === 0) {
    return <div className="text-center mt-20 text-xl">No questions found. Please restart the setup.</div>;
  }

  const handleNext = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      await submitAnswer({
        interview_id: interviewId,
        question_index: currentIndex,
        answer: answer
      });
      
      setAnswer("");
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(curr => curr + 1);
      } else {
        navigate(`/feedback/${interviewId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentIndex) / questions.length) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentIndex) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl mb-6">
        <h2 className="text-2xl font-semibold mb-6 leading-relaxed">
          {questions[currentIndex]}
        </h2>

        <div className="space-y-4">
          <textarea
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
            placeholder="Type your answer here..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          ></textarea>
          
          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              disabled={submitting || !answer.trim()}
              className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <LucideLoader2 className="animate-spin mr-2 w-4 h-4" />
                  Saving...
                </>
              ) : (
                <>
                  <LucideSend className="mr-2 w-4 h-4" />
                  {isLastQuestion ? "Finish & Get Feedback" : "Next Question"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
