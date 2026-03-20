import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
//import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
//new
  // if (!user){
    //return <Navigate to="/register" replace/>
   //}
  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user]);

//new
//console.log("DASHBOARD USER:", user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col">
      <Header />
      <Container>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12 border border-slate-200/60">
          <div className="mb-6">
            <div className="inline-block p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              Welcome to Your Psychometric Assessment
            </h1>
          </div>

          <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
            This assessment helps us understand your thinking style,
            preferences, and behavioral tendencies.  
            It takes about <strong className="text-indigo-600">15–20 minutes</strong> to complete.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              label="Start Assessment"
              onClick={() => navigate("/start-assessment")}
            />

            <Button
              label="Learn More"
              variant="secondary"
              onClick={() => navigate("/instructions")}
            />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}