import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Trophy } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-blue-400" />
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 mb-8">
            <Trophy size={40} className="text-blue-300" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Sports Utility
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
            Manage student achievements, track sports performance, and maintain records — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { label: "Students", desc: "Centralized profiles" },
              { label: "Achievements", desc: "Track every win" },
              { label: "Certificates", desc: "Digital records" },
            ].map((item) => (
              <div key={item.label} className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10">
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Sports Utility</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Sports Achievement Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}