import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      login();
      alert("Login successful! Redirecting to home...");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit: "Login failed. Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handleBackToHome}
              className="absolute left-4 sm:left-6 top-4 sm:top-6 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">StackIt</h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-gray-800 border-gray-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-sm text-red-200">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
              isLoading
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={handleSignUpClick}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Email: demo@stackit.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}