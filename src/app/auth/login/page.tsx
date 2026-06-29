"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GitBranch } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { parseAuthResponse } from "@/lib/auth-session";
import { setAuth } from "@/store/slices/auth-slice";
import { RootState } from "@/store";
import { AUTH_PATH, DASHBOARD_PATH } from "@/routes/path";
import SharedNavigation from "@/app/components/SharedNavigation";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setIsHydrated(true);
    
    // فحص إذا كان المستخدم قادم من صفحة التسجيل
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('signup') === 'success') {
      setSuccessMessage("Account created successfully! Please sign in with your credentials.");
      
      // إزالة معامل URL بعد عرض الرسالة
      const url = new URL(window.location.href);
      url.searchParams.delete('signup');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const response = await axios.post("/auth/login/", { email, password });
      const { token, refreshToken, user } = parseAuthResponse(response.data);

      if (!token) {
        throw new Error("Login failed: token not received from server");
      }

      // حفظ التوكن في localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }

      dispatch(setAuth({ token, user, refreshToken }));
      router.replace(DASHBOARD_PATH.ROOT);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#151b28]" : "bg-gradient-to-br from-[#bed19e] via-[#a8c88a] to-[#9bc07a]"}`}>
      <SharedNavigation />
      <div className="flex-1 flex items-center justify-center py-8 px-4 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className={`rounded-2xl shadow-2xl p-8 border ${isDark ? "border-white/20 bg-[#0f1419]/95" : "border-[#5A7863]/30 bg-white/95"}`}>
            <div className="flex justify-center mb-6">
              <GitBranch className={`w-12 h-12 ${isDark ? "text-[#7dd3fc]" : "text-[#5A7863]"}`} />
            </div>
            <h1 className={`text-3xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-[#2d3e2d]"}`}>Sign In to Gent</h1>
            <p className={`text-center text-sm mb-8 ${isDark ? "text-white/60" : "text-[#2d3e2d]/60"}`}>Welcome back!</p>
            
            {successMessage && (
              <div className={`mb-4 p-3 rounded-md border text-sm ${
                isDark
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-green-50 border-green-200 text-green-600"
              }`}>
                {successMessage}
              </div>
            )}
            
            <div className="mb-4">
              <label className={`text-sm font-bold mb-2 block ${isDark ? "text-white/80" : "text-[#2d3e2d]/80"}`}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} disabled={isLoading} className={`w-full px-4 py-2 rounded-lg border-2 ${isDark ? "border-white/20 bg-white/10 text-white" : "border-[#5A7863]/30 bg-white/50 text-[#2d3e2d]"}`} />
            </div>
            
            <div className="mb-4 relative">
              <label className={`text-sm font-bold mb-2 block ${isDark ? "text-white/80" : "text-[#2d3e2d]/80"}`}>Password</label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} disabled={isLoading} className={`w-full px-4 py-2 pr-10 rounded-lg border-2 ${isDark ? "border-white/20 bg-white/10 text-white" : "border-[#5A7863]/30 bg-white/50 text-[#2d3e2d]"}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10">{showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}</button>
            </div>
            
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            
            <button type="button" onClick={handleLogin} disabled={isLoading} className={`w-full py-3 rounded-lg font-bold ${isDark ? "bg-gradient-to-r from-[#7dd3fc] to-[#06b6d4] text-[#0f1419]" : "bg-gradient-to-r from-[#5A7863] to-[#4a6853] text-white"} disabled:opacity-50`}>{isLoading ? "Signing In..." : "Sign In"}</button>
            
            <div className={`mt-6 text-center text-sm ${isDark ? "text-white/70" : "text-[#2d3e2d]/70"}`}>
              Don&apos;t have an account? <Link href={AUTH_PATH.SIGNIN} className={`font-medium ${isDark ? "text-[#7dd3fc]" : "text-[#5A7863]"}`}>Register</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
