import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Dashboard from "./Dashboard";
import { DollarSign, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ user_name: "", password: "" });
  const [user, setUser] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === "signin" ? "/userLogin" : "/userSignup";
      const res = await axiosInstance.post(endpoint, form);
      if (res.data?.user) setUser(res.data.user);
      else alert("Invalid credentials");
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = () => setUser(null);

  if (user) return <Dashboard user={user} onLogout={handleLogout} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-600 text-white p-3 rounded-full">
            <DollarSign size={28} />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-center text-xl font-semibold">
          Finance Dashboard
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Manage your finances with ease
        </p>

        {/* SignIn/SignUp Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            className={`w-1/2 py-2 text-sm font-medium rounded-md ${
              mode === "signin" ? "bg-white shadow" : "text-gray-500"
            }`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`w-1/2 py-2 text-sm font-medium rounded-md ${
              mode === "signup" ? "bg-white shadow" : "text-gray-500"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium mb-1">User</label>
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              {/* <a href="#" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </a> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full border border-gray-200 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800"
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6">
          Demo: Use any credentials to sign in
        </p>
      </div>
    </div>
  );
}
