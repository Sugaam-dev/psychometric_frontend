import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import StartAssessment from "../pages/StartAssessment";
import Instructions from "../pages/Instructions";
import Assessment from "../pages/Assessment";
import Completion from "../pages/Completion";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/start-assessment" element={<StartAssessment />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/assessment/:sessionId" element={<Assessment />} />
      <Route path="/completed" element={<Completion />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
