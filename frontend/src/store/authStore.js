import { create } from "zustand";
import api from "../api/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: null, // 🔥 ADD THIS

  login: async (role, credentials) => {
    try {
      const res = await api.post(`/${role}/login`, credentials, {
        withCredentials: true,
      });

      const data = res.data;

      const userData = {
        _id: data._id,
        name: data.name || data.hospitalName,
        email: data.email,
      };

      // 🔥 STORE TOKEN
      set({
        user: userData,
        role,
        token: data.token, // 🔥 IMPORTANT
      });

      return {
        success: true,
        user: userData,
        role,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async (role) => {
    try {
      await api.post(`/${role}/logout`, {}, { withCredentials: true });
    } finally {
      set({ user: null, role: null, token: null }); // CLEAR TOKEN
    }
  },
}));
