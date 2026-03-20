import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");


  const handleRegister = async () => {
    if (!name || !email || !age || !role) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        phone: phone || null,
        age: Number(age),
        role,
      };

      const res = await api.post("/users/register", payload);
        // new 
 //       console.log("REGISTER RESPONSE:", res.data);
  //      console.log("SETTING USER:", {
  //id: res.data.user_id,
  //name: res.data.user_name,
  //role: res.data.assigned_role
//});
      setUser({
        id: res.data.user_id,
        //new
      //  name: res.data.user_name,
        role: res.data.role,
        session_id: res.data.session_id
      });
//new
//console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err?.response?.data);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex flex-col">
      <Header />
      <Container>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12 max-w-xl mx-auto border border-slate-200/60">
          <div className="mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              Register to Begin
            </h1>
            <p className="text-slate-600">
              Please provide your details to start the assessment
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Optional"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select your role</option>
                <option value="class_9_10">Class 9–10</option>
                <option value="class_11_12">Class 11–12</option>
                <option value="university">University Student</option>
                <option value="teacher">Teacher</option>
                <option value="corporate">Corporate</option>
                <option value="manager">Manager</option>
                <option value="exco">EXCO</option>
                <option value="homemaker_senior">Homemaker / Senior</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <Button
              label={loading ? "Registering..." : "Register"}
              onClick={handleRegister}
            />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}