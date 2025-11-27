import { create } from "zustand";
import api from "../api/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,

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

      // Store in Zustand
      set({
        user: userData,
        role,
      });

      // Return full data to Login.jsx
      return {
        success: true,
        user: userData,
        role,
        raw: data,
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

      set({ user: null, role: null });
    } catch (error) {
      console.log("Logout error:", error);
    }
  },
}));
