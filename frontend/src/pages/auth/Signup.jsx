import React, { useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "sonner";

export default function Signup({ onSuccess }) {
  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(null);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const validateLicense = (license) => /^KL\/[A-Z]{2}\/\d{4}$/.test(license);

  // Password validation
  const validatePassword = (password) => {
    // Minimum 5 chars + at least 1 special character
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
    return regex.test(password);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    // 🔴 Password validation
    if (!validatePassword(form.password || "")) {
      toast.error(
        "Password must be at least 5 characters and contain a special character"
      );
      return;
    }

    // 🔴 Hospital license validation
    if (role === "hospital" && !validateLicense(form.licenseNumber)) {
      toast.error("Invalid License Number format. Use: KL/AB/1234");
      return;
    }

    try {
      await api.post(`/${role}/register`, form);

      setSuccess("Account created successfully!");
      toast.success("Signup successful! Please login now.");

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex items-center justify-center">
      <div
        className="
          bg-white dark:bg-gray-900 
          shadow-lg p-7 rounded-xl w-96
          border border-gray-200 dark:border-gray-700
        "
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Sign Up
        </h2>

        {/* ROLE SELECTION */}
        <div className="flex gap-3 mb-4">
          {["donor", "recipient", "hospital"].map((r) => (
            <label
              key={r}
              className="flex gap-2 items-center capitalize text-gray-800 dark:text-gray-300"
            >
              <input
                type="radio"
                checked={role === r}
                onChange={() => setRole(r)}
                className="accent-red-600 dark:accent-red-400"
              />
              {r}
            </label>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {/* NAME / HOSPITAL NAME */}
          <input
            className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder={role === "hospital" ? "Hospital Name" : "Name"}
            onChange={(e) =>
              role === "hospital"
                ? update("hospitalName", e.target.value)
                : update("name", e.target.value)
            }
          />

          {/* EMAIL */}
          <input
            type="email"
            className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Email"
            onChange={(e) => update("email", e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Password"
            onChange={(e) => update("password", e.target.value)}
          />

          {/* HOSPITAL FIELDS */}
          {role === "hospital" && (
            <>
              <input
                className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="License Number (KL/AB/1234)"
                onChange={(e) => update("licenseNumber", e.target.value)}
              />
              <input
                className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Address"
                onChange={(e) => update("address", e.target.value)}
              />
            </>
          )}

          {/* DONOR & RECIPIENT FIELDS */}
          {role !== "hospital" && (
            <>
              <input
                className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Age"
                onChange={(e) => update("age", e.target.value)}
              />

              <select
                className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onChange={(e) => update("bloodGroup", e.target.value)}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              {role === "recipient" && (
                <input
                  className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Medical Condition (optional)"
                  onChange={(e) => update("medicalCondition", e.target.value)}
                />
              )}

              {role === "donor" && (
                <input
                  className="border p-2 rounded w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Weight (kg)"
                  onChange={(e) => update("weight", e.target.value)}
                />
              )}
            </>
          )}

          {success && (
            <p className="text-green-600 dark:text-green-400 text-sm">
              {success}
            </p>
          )}

          <button
            className="w-full bg-red-600 dark:bg-red-500 text-white py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
