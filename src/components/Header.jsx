import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Simple top bar: mobile sidebar toggle on one side, admin identity + logout on the other.
 */
export default function Header({ title, onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 sm:text-xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
            A
          </div>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">
            Admin
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
          aria-label="تسجيل الخروج"
          title="تسجيل الخروج"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}
