import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { DollarSign, Eye, EyeOff } from "lucide-react";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ user_name: "", email: "", password: "", phone_number: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let payload = {};

      if (mode === "signin") {
        // LOGIN
        endpoint = "/userLogin";
        payload = {
          user_name: form.user_name,
          password: form.password,
        };
      } else {
        // SIGNUP
        endpoint = "/crate_user";
        payload = {
          ...form,
          reaming_balance: 0,  // Matches your backend response format
        };
      }

      const res = await axiosInstance.post(endpoint, payload);

      let userData = null;

      if (mode === "signin") {
        // For login: Expect direct user object
        if (res.data?._id) {
          userData = res.data;
        }
      } else {
        // For signup: Expect {status: true, message: "..."}
        if (res.data?.status === true) {
          // Auto-login after successful signup to get user object
          const loginRes = await axiosInstance.post("/userLogin", {
            user_name: form.user_name,
            password: form.password,
          });
          if (loginRes.data?._id) {
            userData = loginRes.data;
          }
        }
      }

      if (userData) {
        // Store user in localStorage for persistence across sessions
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Request failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          {/* Logo */}
          <div className="d-flex justify-content-center mb-4">
            <div className="bg-primary text-white p-3 rounded-circle" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={28} />
            </div>
          </div>

          {/* Header */}
          <h2 className="text-center mb-1 fw-semibold">Expense Dashboard</h2>
          <p className="text-center text-muted mb-4 small">
            Manage your finances with ease
          </p>

          {/* SignIn/SignUp Toggle */}
          <div className="d-flex bg-light rounded-pill p-1 mb-4">
            <button
              type="button"
              className={`flex-fill py-2 border-0 rounded-pill text-sm fw-medium ${mode === "signin" ? "bg-white shadow-sm text-primary" : "text-muted bg-transparent"}`}
              onClick={() => setMode("signin")}
            >
              Log In
            </button>
            <button
              type="button"
              className={`flex-fill py-2 border-0 rounded-pill text-sm fw-medium ${mode === "signup" ? "bg-white shadow-sm text-primary" : "text-muted bg-transparent"}`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium">Username</label>
              <input
                type="text"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                placeholder="Enter username"
                required
                className="form-control"
              />
            </div>

            {/* EMAIL - Only for signup */}
            {mode === "signup" && (
              <div className="mb-3">
                <label className="form-label small fw-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="form-control"
                />
              </div>
            )}

            {/* PHONE - Only for signup */}
            {mode === "signup" && (
              <div className="mb-3">
                <label className="form-label small fw-medium">Phone No</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="form-control"
                />
              </div>
            )}

            {/* PASSWORD */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-medium">Password</label>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="form-control pe-5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute end-0 top-50 translate-middle-y pe-3 text-muted border-0 bg-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 mb-2"
            >
              {mode === "signin" ? "Log In" : "Sign Up"}
            </button>
          </form>
          {/* <p className="text-center text-muted small mt-3 mb-0">
            Demo: Use any credentials to sign in
          </p> */}
        </div>
      </div>
    </div>
  );
}