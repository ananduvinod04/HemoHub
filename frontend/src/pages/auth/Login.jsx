import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [role, setRole] = useState("donor"); // donor | recipient | hospital | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await login(role, { email, password });

    if (res.success) navigate("/");
    if (res.success){
     console.log(res);
    }
   
    else setError(res.message);
  };

  return (
    <div className="flex items-center justify-center">

      <div className="bg-white shadow-xl p-7 w-96 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {/* ROLE SELECTION */}
        <div className="flex flex-wrap gap-3 mb-4">
          {["donor", "recipient", "hospital", "admin"].map((r) => (
            <label key={r} className="flex items-center gap-2 capitalize">
              <input
                type="radio"
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r}
            </label>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button className="w-full bg-red-600 text-white py-2 rounded-lg">
            Sign In
          </button>
        </form>

    
      </div>

    </div>
  );
}
