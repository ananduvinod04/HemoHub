import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../api/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: Cookies.get("token") || null,

  login: async (role, credentials) => {
    try {
      const res = await api.post(`/${role}/login`, credentials);
      const data = res.data;

      Cookies.set("token", data.token);

      set({
        user: { _id: data._id, name: data.name || data.hospitalName },
        role,
        token: data.token,
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null, role: null, token: null });
  },
}));
