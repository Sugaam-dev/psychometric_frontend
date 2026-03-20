import api from "./axios";

export const startAssessment = async (userId: number) => {
  const res = await api.post("/assessment/start", null, {
    params: { user_id: userId },
  });
  return res.data;
};

export const fetchNextQuestion = async (
  sessionId: number,
  page: number
) => {
  const res = await api.get("/assessment/questions", {
    params: {
      session_id: sessionId,
      page,
      page_size: 1,
    },
  });
  return res.data;
};

export const submitAnswer = async (payload: {
  user_id: number;
  session_id: number;
  question_id: number;
  raw_score: number;
}) => {
  const res = await api.post("/assessment/submit", null, {
    params: payload,
  });
  return res.data;
};

export const downloadReport = (sessionId: number) => {
  window.open(
    `http://127.0.0.1:8000/reports/${sessionId}/pdf`,
    "_blank"
  );
};
