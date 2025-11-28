"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone } from "lucide-react";
import { apiCall } from "@/lib/services/api-client";
import { Utils } from "@/lib/services/storage";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  interface AuthResponse {
    success: boolean;
    message: string;
    data: any;
  }

  const handleSignup = async () => {
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      mobile: mobile || null,
    };

    try {
      setLoading(true);

      const response: AuthResponse = await apiCall({
        endPoint: "users/signup",
        method: "POST",
        data: payload,
        isMultipart: false,
      });

      if (response.success) {
        Utils.setItem("authToken", response.data.token);
        Utils.setItem("id", response.data.user.id);
        Utils.setItem("role", response.data.user.role);
        router.push("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Join ConnectHub today 🚀
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">First Name</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <User size={18} className="text-gray-400" />
            <input
              type="text"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Last Name</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <User size={18} className="text-gray-400" />
            <input
              type="text"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Mobile (optional)</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <Phone size={18} className="text-gray-400" />
            <input
              type="number"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Password</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Confirm Password</label>
          <div className="flex items-center border rounded-lg px-3 bg-gray-50">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              className="w-full bg-transparent p-3 outline-none"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all font-medium hover:cursor-pointer"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
