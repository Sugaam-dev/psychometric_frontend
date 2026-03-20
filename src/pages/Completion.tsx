import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import api from "../api/axios";

type ReportStatus = "polling" | "ready" | "error";

export default function Completion() {
  const { user } = useUser();
  const [reportStatus, setReportStatus] = useState<ReportStatus>("polling");
//old 
  /** 
  useEffect(() => {
    if (!user?.session_id) return;

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 30; // 30 × 3s = 90s max wait

    const poll = async () => {
      while (!cancelled && attempts < MAX_ATTEMPTS) {
        try {
          // HEAD request — returns 200 when PDF is ready, throws on 404/202 while generating
          const res = await api.head(`/reports/${user.session_id}/pdf`);
          if (res.status === 200) {
            if (!cancelled) setReportStatus("ready");
            return;
          }
        } catch (err: any) {
          const status = err?.response?.status;
          if (status !== 404 && status !== 202) {
            // Unexpected error — stop polling
            if (!cancelled) setReportStatus("error");
            return;
          }
          // 404 / 202 = still generating, keep going
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      // Timed out after 90s
      if (!cancelled) setReportStatus("error");
    };

    poll();
    return () => { cancelled = true; };
  }, [user?.session_id]);
 */
//new 
/** 
useEffect(() => {
  if (!user?.session_id) return;

  let cancelled = false;
  const MAX_ATTEMPTS = 15;

  const checkPDF = async (attempt = 0) => {
    if (cancelled) return;

    try {
      const res = await api.head(`/reports/${user.session_id}/pdf`);

      if (res.status === 200) {
        if (!cancelled) setReportStatus("ready");
        return;
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status !== 404 && status !== 202) {
        if (!cancelled) setReportStatus("error");
        return;
      }
    }

    if (attempt >= MAX_ATTEMPTS) {
      if (!cancelled) setReportStatus("error");
      return;
    }

    const delay = Math.min(5000 + attempt * 5000, 30000);

    setTimeout(() => {
      checkPDF(attempt + 1);
    }, delay);
  };

  checkPDF();

  return () => {
    cancelled = true;
  };
}, [user?.session_id]);
*/
useEffect(() => {
  if (!user?.session_id) return;

   // SSE uses api.defaults.baseURL so it stays in sync with your axios config
    const eventSource = new EventSource(
      `${api.defaults.baseURL}/reports/${user.session_id}/status`
    );

eventSource.onmessage = (event) => {
      if (event.data === "ready") {
        setReportStatus("ready");
      } else if (event.data === "timeout") {
        setReportStatus("error");
      }
      eventSource.close();
    };

  eventSource.onerror = () => {
      setReportStatus((prev) => (prev === "polling" ? "error" : prev));
      eventSource.close();
    };
  
  return () => {
    eventSource.close();
  };
}, [user?.session_id]);
// Goes through axios — your auth headers and interceptors all apply
  const handleDownload = async () => {
    if (!user?.session_id) return;
    try {
      const res = await api.get(`/reports/${user.session_id}/pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `psychometric_report_${user.session_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setReportStatus("error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <p className="text-red-600">Session not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="text-center max-w-md">

          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg animate-bounce-in">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Assessment Completed! 🎉
          </h1>

          <p className="text-slate-600 mb-8">
            Congratulations on completing your psychometric assessment.
          </p>

          {/* Polling — report still generating */}
          {reportStatus === "polling" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">
                Your report is being generated, please wait…
              </p>
            </div>
          )}

          {/* Ready — show download button */}
          {reportStatus === "ready" && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold animate-fade-in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </button>
          )}

          {/* Error — timed out or unexpected failure */}
          {reportStatus === "error" && (
            <div className="flex flex-col items-center gap-3">
              <div className="inline-block p-3 bg-amber-100 rounded-full">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm">
                Report generation is taking longer than expected.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-medium text-sm"
              >
                Try downloading anyway
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}