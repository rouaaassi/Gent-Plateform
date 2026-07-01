"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GitBranch, AlertTriangle } from "lucide-react";
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
        console.log('✅ Token saved to localStorage:', {
          token: token.substring(0, 20) + '...',
          refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : 'none'
        });
      }

      // حفظ في Redux store
      dispatch(setAuth({ token, user, refreshToken }));
      
      // توجيه للـ Dashboard
      router.replace(DASHBOARD_PATH.ROOT);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <div className={`min-h-screen ${
      isDark ? "bg-[#0d1117]" : "bg-[#f6f8fa]"
    }`}>
      <SharedNavigation />
      
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`p-3 rounded-lg ${
                isDark 
                  ? "bg-[#21262d] border border-[#30363d]" 
                  : "bg-white border border-[#d1d9e0]"
              }`}>
                <GitBranch className={`w-8 h-8 ${
                  isDark ? "text-[#f0f6fc]" : "text-[#24292f]"
                }`} />
              </div>
            </div>
            <h2 className={`text-2xl font-semibold ${
              isDark ? "text-[#f0f6fc]" : "text-[#24292f]"
            }`}>
              Sign in to Gent
            </h2>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-lg border p-8 shadow-sm ${
              isDark
                ? "bg-[#21262d] border-[#30363d]"
                : "bg-white border-[#d1d9e0]"
            }`}
          >
            {/* Success Message */}
            {successMessage && (
              <div className={`mb-6 flex items-center gap-3 text-sm p-3 rounded-md border ${
                isDark
                  ? "bg-[#0d4a2c] border-[#238636] text-[#2ea043]"
                  : "bg-[#dcfce7] border-[#22c55e] text-[#15803d]"
              }`}>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`mb-6 flex items-center gap-3 text-sm p-3 rounded-md border ${
                isDark
                  ? "bg-[#ffeef0] border-[#f85149] text-[#d1242f]"
                  : "bg-[#fff1f3] border-[#d1242f] text-[#cf222e]"
              }`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${
                  isDark ? "text-[#f0f6fc]" : "text-[#24292f]"
                }`}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDark
                      ? "border-[#30363d] bg-[#21262d] text-[#f0f6fc] placeholder:text-[#8d96a0] focus:border-[#1f6feb] focus:ring-[#1f6feb]/25"
                      : "border-[#d1d9e0] bg-[#ffffff] text-[#24292f] placeholder:text-[#656d76] focus:border-[#0969da] focus:ring-[#0969da]/25"
                  }`}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className={`text-sm font-medium block ${
                  isDark ? "text-[#f0f6fc]" : "text-[#24292f]"
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className={`w-full px-3 py-2 pr-10 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDark
                        ? "border-[#30363d] bg-[#21262d] text-[#f0f6fc] placeholder:text-[#8d96a0] focus:border-[#1f6feb] focus:ring-[#1f6feb]/25"
                        : "border-[#d1d9e0] bg-[#ffffff] text-[#24292f] placeholder:text-[#656d76] focus:border-[#0969da] focus:ring-[#0969da]/25"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${
                      isDark ? "text-[#8d96a0] hover:text-[#f0f6fc]" : "text-[#656d76] hover:text-[#24292f]"
                    }`}
                  >
                    {showPassword ? <AiFillEyeInvisible size={16} /> : <AiFillEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? "bg-[#238636] text-white hover:bg-[#2ea043] disabled:bg-[#238636]"
                    : "bg-[#1f883d] text-white hover:bg-[#1a7f37] disabled:bg-[#1f883d]"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className={`text-center text-sm mt-6 ${
              isDark ? "text-[#8d96a0]" : "text-[#656d76]"
            }`}>
              New to Gent?{" "}
              <Link
                href={AUTH_PATH.SIGNIN}
                className={`font-medium hover:underline ${
                  isDark ? "text-[#58a6ff]" : "text-[#0969da]"
                }`}
              >
                Create an account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
