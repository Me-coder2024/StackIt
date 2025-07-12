import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      console.log("Sign up attempt:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      });
      
      // Simulate successful sign up
      alert("Account created successfully! Please check your email to verify your account.");
      navigate("/login");
      
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors({
        submit: "Failed to create account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSignInClick = () => {
    navigate("/login");
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
            Create your account
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Join StackIt to get started
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="First name"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Last name"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

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
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-gray-800 border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>
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
                Creating account...
              </div>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={handleSignInClick}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
          </ul>
        </div>
      </div>
    </div>
  );
}