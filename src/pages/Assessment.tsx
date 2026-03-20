import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../components/layout/Container";
import QuestionCard from "../components/assessment/QuestionCard";
import LikertScale from "../components/assessment/LikertScale";
import ProgressBar from "../components/assessment/ProgressBar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useUser } from "../context/UserContext";
import {
  fetchNextQuestion,
  submitAnswer,
} from "../api/assessment.api";

type Question = {
  question_id: number;
  question_text: string;
  test_domain: string;
  dimension: string;
  reverse_scored: boolean;
};

export default function Assessment() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Container>
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xl text-red-600 font-semibold">Invalid assessment session.</p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate("/register");
    return null;
  }

  const userId = user.id;
  const sessionIdNum = parseInt(sessionId, 10);

  useEffect(() => {
    loadQuestion(1);
  }, []);

  const loadQuestion = async (page: number) => {
    setLoading(true);
    setSelectedValue(null);
    
    const data = await fetchNextQuestion(sessionIdNum, page);

    if (data.status === "COMPLETED") {
      navigate("/completed");
      return;
    }

    setQuestion(data.questions[0]);
    setAnswered(data.page - 1);
    setTotal(data.total_questions);
    setQuestionKey(prev => prev + 1);
    setLoading(false);
  };

  const handleAnswer = async (score: number) => {
    if (!question || submitting) return;

    try {
      setSubmitting(true);
      setSelectedValue(score);

      const res = await submitAnswer({
        user_id: userId,
        session_id: sessionIdNum,
        question_id: question.question_id,
        raw_score: score,
      });

      if (res.status === "COMPLETED") {
        // Navigate immediately — report generation happens on the Completion page
        navigate("/completed");
        return;
      }

      // Show success animation only for non-final answers
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setShowSuccess(false);

      loadQuestion(answered + 2);
    } catch (err) {
      setShowSuccess(false);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !question) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-6 text-lg text-slate-600 animate-pulse">
              Loading your next question...
            </p>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  const progress = Math.round((answered / total) * 100);
  const isLastQuestion = answered === total - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col">
      <Header />
      <Container>
        {/* Header Section */}
        <div className="pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Psychometric Assessment
            </h1>
            <p className="text-slate-600">
              Take your time and answer honestly for accurate results
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <ProgressBar answered={answered} total={total} />

          {/* Milestone indicators */}
          {progress === 25 && (
            <div className="text-center mt-4 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                🎯 Quarter way there! Keep going!
              </span>
            </div>
          )}
          {progress === 50 && (
            <div className="text-center mt-4 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                🌟 Halfway done! You're doing great!
              </span>
            </div>
          )}
          {progress === 75 && (
            <div className="text-center mt-4 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                🚀 Almost there! Just a few more questions!
              </span>
            </div>
          )}
        </div>

        {/* Main Assessment Area */}
        <div className="max-w-4xl mx-auto">
          {/* Question Card with animation */}
          <div 
            key={questionKey}
            className="animate-slide-up"
          >
            <QuestionCard question={question} />
          </div>

          {/* Likert Scale */}
          <div className="animate-slide-up animation-delay-100">
            <LikertScale
              onSelect={handleAnswer}
              disabled={submitting}
              selectedValue={selectedValue}
            />
          </div>

          {/* Navigation Hints */}
          <div className="mt-8 flex justify-between items-center text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Click an option to continue</span>
            </div>
            {isLastQuestion && (
              <div className="flex items-center gap-2 text-green-600 font-medium animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Last question!</span>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips for accurate results
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Answer based on your natural tendencies, not what you think is "correct"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Don't overthink – your first instinct is usually most accurate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>There are no right or wrong answers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-scale-in">
              <div className="bg-green-500 text-white p-6 rounded-full shadow-2xl">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Container>
      <Footer />

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
}