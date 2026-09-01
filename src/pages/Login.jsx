import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Star, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Mock login form. No real backend call — see AuthContext for details.
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-xl font-bold text-slate-800">تسجيل الدخول</h1>
          <p className="text-sm text-slate-400">
            مرحبًا بك مجددًا في The Star Academy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              اسم المستخدم
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-300"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-4 pr-11 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-300"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-4 pr-11 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            تسجيل الدخول
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-slate-400 hover:text-slate-600"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
