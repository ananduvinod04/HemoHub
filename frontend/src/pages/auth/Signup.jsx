import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function Signup() {
  const [role, setRole] = useState("donor"); // donor | recipient | hospital
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const update = (key, value) => setForm({ ...form, [key]: value });

  // 🔥 Hospital License Regex Validator
  const validateLicense = (license) => {
    const regex = /^KL\/[A-Z]{2}\/\d{4}$/;
    return regex.test(license);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 🔥 Validate only for hospital role
    if (role === "hospital" && !validateLicense(form.licenseNumber)) {
      setError("Invalid License Number format. Use: KL/AB/1234");
      return;
    }

    try {
      const res = await api.post(`/${role}/register`, form);
      setSuccess("Account created successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg p-7 rounded-xl w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        {/* ROLE SELECTION */}
        <div className="flex gap-3 mb-4">
          {["donor", "recipient", "hospital"].map((r) => (
            <label key={r} className="flex gap-2 items-center capitalize">
              <input
                type="radio"
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r}
            </label>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">

         <input
  className="border p-2 rounded w-full"
  placeholder={role === "hospital" ? "Hospital Name" : "Name"}
  onChange={(e) =>
    role === "hospital"
      ? update("hospitalName", e.target.value) // 🔥 correct field
      : update("name", e.target.value)
  }
/>

          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            onChange={(e) => update("email", e.target.value)}
          />

          <input
            type="password"
            className="border p-2 rounded w-full"
            placeholder="Password"
            onChange={(e) => update("password", e.target.value)}
          />

          {/* HOSPITAL FIELDS */}
          {role === "hospital" && (
            <>
              <input
                className={`border p-2 rounded w-full ${
                  form.licenseNumber &&
                  !validateLicense(form.licenseNumber)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="License Number (KL/AB/1234)"
                onChange={(e) => update("licenseNumber", e.target.value)}
              />

              <input
                className="border p-2 rounded w-full"
                placeholder="Address"
                onChange={(e) => update("address", e.target.value)}
              />
            </>
          )}

          {/* DONOR + RECIPIENT FIELDS */}
          {role !== "hospital" && (
            <>
              <input
                className="border p-2 rounded w-full"
                placeholder="Age"
                onChange={(e) => update("age", e.target.value)}
              />

              <input
                className="border p-2 rounded w-full"
                placeholder="Blood Group"
                onChange={(e) => update("bloodGroup", e.target.value)}
              />
            </>
          )}

          {/* DONOR UNIQUE FIELD */}
          {role === "donor" && (
            <input
              className="border p-2 rounded w-full"
              placeholder="Weight"
              onChange={(e) => update("weight", e.target.value)}
            />
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button className="w-full bg-red-600 text-white py-2 rounded-lg">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
