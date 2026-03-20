import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { startAssessment } from "../api/assessment.api";
import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function StartAssessment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useUser();

  if (!user) {
    navigate("/register");
    return;
  }

  const userId = user.id;
  if (!user || !user.id) {
    alert("User not registered properly");
    return;
  }
  console.log("Starting assessment for user:", user.id);

  const handleStart = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const data = await startAssessment(userId);

      setUser({
        session_id: data.session_id
      });

      // backend returns session_id
      navigate(`/assessment/${data.session_id}`);
    } catch (error) {
      alert("Failed to start assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col">
      <Header />
      <Container>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-slate-200/60 max-w-2xl mx-auto">
          <div className="inline-block p-4 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Ready to Begin?
          </h1>

          <p className="text-slate-600 text-base sm:text-lg mb-4 leading-relaxed">
            Once you start, the assessment will continue from where you left off.  
            Please answer honestly – there are no right or wrong answers.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
            <div className="flex items-start gap-3 text-left">
              <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-slate-700 font-semibold mb-1">Estimated Time</p>
                <p className="text-slate-600">This will take approximately 15-20 minutes to complete</p>
              </div>
            </div>
          </div>

          <Button
            label={loading ? "Starting..." : "Begin Assessment"}
            onClick={handleStart}
          />
        </div>
      </Container>
      <Footer />
    </div>
  );
}