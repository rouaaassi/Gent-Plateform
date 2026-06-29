"use client";

import { useState } from "react";
import InputField from "./InputField";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import { validateSignUp } from "@/utils/validateSignUp";
import { AUTH_PATH } from "@/routes/path";
import axios from "@/lib/axios";
import { AxiosError, isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignUpData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

interface ApiError {
  error: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setError("");

    const validationError = validateSignUp(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/auth/register/", formData);
      
      // بعد التسجيل الناجح، توجيه المستخدم إلى صفحة تسجيل الدخول
      router.push(`${AUTH_PATH.LOGIN}?signup=success`);
      
    } catch (err) {
      let errorMessage = "Sign up failed";

      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<ApiError>;
        errorMessage = axiosErr.response?.data.error || axiosErr.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-4 w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
      {error && (
        <motion.div
          className={`text-sm p-3 rounded-md border ${
            isDark
              ? "bg-red-500/20 border-red-500/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}

      <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
        <InputField
          label="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="John"
          required
        />
        <InputField
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Doe"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
        />
      </motion.div>

      <motion.div className="relative" variants={itemVariants}>
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-9 cursor-pointer transition-colors ${
            isDark ? "text-white/60 hover:text-white" : "text-[#2d3e2d]/60 hover:text-[#2d3e2d]"
          }`}
          tabIndex={-1}
        >
          {showPassword ? (
            <AiFillEyeInvisible size={20} />
          ) : (
            <AiFillEye size={20} />
          )}
        </button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <InputField
          label="Confirm Password"
          type="password"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </motion.div>

      <motion.button
        type="button"
        onClick={() => handleSubmit()}
        className={`w-full font-bold py-2 px-4 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
          isDark
            ? "bg-gradient-to-r from-[#7dd3fc] to-[#06b6d4] text-[#0f1419] hover:shadow-lg hover:shadow-cyan-500/50"
            : "bg-gradient-to-r from-[#5A7863] to-[#4a6853] text-white hover:shadow-lg hover:shadow-green-500/50"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        variants={itemVariants}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </motion.button>

      <motion.div 
        className={`text-center text-sm mt-4 ${
          isDark ? "text-white/70" : "text-[#2d3e2d]/70"
        }`}
        variants={itemVariants}
      >
        Already have an account?{" "}
        <Link
          href={AUTH_PATH.LOGIN}
          className={`font-medium hover:underline transition-colors ${
            isDark ? "text-[#7dd3fc] hover:text-white" : "text-[#5A7863] hover:text-[#2d3e2d]"
          }`}
        >
          sign in
        </Link>
      </motion.div>
      </motion.div>
    </div>
  );
}
