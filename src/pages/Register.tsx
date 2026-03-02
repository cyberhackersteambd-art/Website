import { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../App";
import { User, Mail, Lock, ArrowRight, Store } from "lucide-react";

export default function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "customer";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: role
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      login(data);
      navigate(data.role === 'vendor' ? "/vendor" : "/");
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
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-500">
                {role === 'vendor' ? "Register your store on DarazClone" : "Join our shopping community"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {role === 'vendor' && (
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
                  <Store className="text-orange-500 shrink-0" size={20} />
                  <p className="text-xs text-orange-700 leading-relaxed">
                    By registering as a vendor, you'll be able to list products, manage inventory, and track your sales performance.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group"
              >
                Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
