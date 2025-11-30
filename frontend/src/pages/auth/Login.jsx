import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [role, setRole] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] =useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await login(role, { email, password });

    if (res.success) {
      toast.success("Login successful!");
      navigate(`/${role}`);
    } else {
      setError(res.message);
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="
          bg-white dark:bg-gray-900 
          shadow-xl p-7 w-96 rounded-xl 
          border border-gray-200 dark:border-gray-700
        "
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Login
        </h2>

        {/* ROLE SELECTOR */}
        <div className="flex flex-wrap gap-3 mb-4">
          {["donor", "recipient", "hospital", "admin"].map((r) => (
            <label
              key={r}
              className="
                flex items-center gap-2 capitalize
                text-gray-800 dark:text-gray-300
              "
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

        <form onSubmit={submit} className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            className="
              w-full border p-2 rounded
              border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
            "
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="
              w-full border p-2 rounded
              border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
            "
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            className="
              w-full bg-red-600 dark:bg-red-500 
              text-white py-2 rounded-lg 
              hover:bg-red-700 dark:hover:bg-red-600
              transition
            "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
