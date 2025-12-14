import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ from env
  withCredentials: true,                 // ✅ cookies/JWT
});

export default api;
