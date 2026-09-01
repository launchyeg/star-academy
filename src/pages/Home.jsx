import { Link } from "react-router-dom";
import { Star } from "lucide-react";

/**
 * Minimal public landing page with navbar, welcome message, and footer.
 */
export default function Home() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-base font-bold text-slate-800">
              The Star Academy
            </span>
          </div>

          <Link
            to="/login"
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            تسجيل الدخول
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
            مرحبًا بك في The Star Academy
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">
            منصة إدارة أكاديمية بسيطة وحديثة لمتابعة المجموعات والطلاب بكل
            سهولة.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-white py-6 text-center text-sm text-slate-400">
        The Star Academy © 2026 Developed by{" "}
        <a
          href="https://aaaportfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          Launchy
        </a>
      </footer>
    </div>
  );
}
