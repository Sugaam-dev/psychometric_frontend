import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col">
      <Header />
      <Container>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12 border border-slate-200/60">
          <div className="mb-6">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
              Assessment Instructions
            </h1>
          </div>

          <div className="space-y-4 mb-10">
            {[
              "The assessment consists of multiple statements.",
              "For each statement, select how much you agree or disagree.",
              "There are no right or wrong answers.",
              "Answer honestly for the most accurate results.",
              "Once submitted, answers cannot be changed.",
              "Your progress is automatically saved."
            ].map((instruction, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-xl border border-slate-200/60 transition-all hover:shadow-md hover:border-indigo-200">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </div>
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed pt-0.5">
                  {instruction}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              label="Start Assessment"
              onClick={() => navigate("/start-assessment")}
            />

            <Button
              label="Back to Dashboard"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}