"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { apiCall } from "@/lib/services/api-client";
import { Utils } from "@/lib/services/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
  }

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const payload = { email, password };

    try {
      setLoading(true);

      const response: ApiResponse = await apiCall({
        endPoint: "users/login",
        method: "POST",
        data: payload,
        isMultipart: false,
      });

      if (response.success && response.data) {
        setData(response.data);
        Utils.setItem("authToken", response.data?.token);
        Utils.setItem("id", response.data.user.id);
        Utils.setItem("role", response.data.user.role);
        router.push("/dashboard");
      } else if (!response.success) {
        setError(response.message);
      }
    } catch (error: any) {
      console.error("Error in signup", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Login to continue to ConnectHub
        </p>

        {/* 🔥 Error Message */}
        {error && (
          <p className="text-red-500 bg-red-100 border border-red-300 px-3 py-2 rounded-md text-center mb-5">
            {error}
          </p>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Email</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Password</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all font-medium hover:cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
