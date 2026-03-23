import axios from "axios";

const api = axios.create({
  baseURL: "https://psy.sugaam.in",
});

export default api;
