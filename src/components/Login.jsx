import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Code2,
  Github,
  Users,
  Globe,
} from "lucide-react";
import axios from "axios";
import { toast } from 'react-hot-toast';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });

  const BASE_URL = "http://localhost:3000";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const LOGIN_URL = `${BASE_URL}/login`;
    const { emailId, password } = formData;
    try {
      const response = await axios.post(LOGIN_URL, { emailId, password },{withCredentials: true });
      console.log("Login successful:", response.data);
      toast.success("Login successful!");

    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      alert("Login failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignup = async () => {
    const SIGNUP_URL = `${BASE_URL}/signup`;
    const { firstName, lastName, emailId, password } = formData;
    try {
      const response = await axios.post(SIGNUP_URL, {
        firstName,
        lastName,
        emailId,
        password,
      });
      console.log("Signup successful:", response.data);
      // Optionally auto-switch to login
      setIsSignup(false);
      alert("Signup successful! You can now login.");
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );
      toast.error("Signup failed.");
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.emailId ||
      !formData.password ||
      (isSignup && (!formData.firstName || !formData.lastName))
    ) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleGithubLogin = () => {
    alert("Redirecting to GitHub OAuth...");
  };

  return (
    <div className="min-h-[85vh] md:min-h-screen bg-gray-900 flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">DevTinder</h1>
              <p className="text-gray-400 text-sm">
                Networking Platform for Developers
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Connect. Collaborate. Grow.
          </h2>
          <p className="text-gray-300 text-lg">
            DevTinder helps developers find and connect with like-minded
            professionals based on skills, interests, and goals.
          </p>
          <div className="grid grid-cols-2 gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>50K+ Developers</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>100+ Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center mr-2">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white">DevTinder</h1>
          </div>

          {/* Auth Card */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignup ? "Create an Account" : "Sign In"}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {isSignup
                ? "Signup to join the developer network."
                : "Login to your account to explore connections."}
            </p>

            <div className="space-y-4">
              {isSignup && (
                <>
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="text-sm text-gray-300 font-medium">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="text-sm text-gray-300 font-medium">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-gray-700 text-white rounded-md pl-10 pr-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full bg-gray-700 text-white rounded-md pl-10 pr-10 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-200 disabled:opacity-50"
              >
                {isLoading
                  ? isSignup
                    ? "Signing up..."
                    : "Signing in..."
                  : isSignup
                  ? "Sign Up"
                  : "Sign In"}
              </button>

              {/* GitHub Login */}
              {!isSignup && (
                <button
                  onClick={handleGithubLogin}
                  className="w-full flex items-center justify-center border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-all duration-200"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Sign in with GitHub
                </button>
              )}
            </div>

            {/* Toggle Text */}
            <p className="text-center text-gray-400 text-sm mt-6">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsSignup(false)}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsSignup(true)}
                  >
                    Sign up free
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
