import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password })
    });
    const data = await res.json();
    if (res.ok) {
      login(data);
      if (data.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Login to your DarazClone account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Link to="#" className="text-xs font-bold text-orange-500 hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-orange-500 font-bold hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <Link to="/register?role=vendor" className="text-slate-600 text-sm font-medium hover:text-orange-500 transition-colors">
              Want to sell on DarazClone? <span className="font-bold">Register as Vendor</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
