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
import { useDispatch } from "react-redux";
import { loginSuccess } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { emailId, password, firstName, lastName } = formData;
    if (!emailId || !password) return "Email and password are required.";
    if (isSignup && (!firstName || !lastName)) return "Full name is required for signup.";
    return "";
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    const validationError = validateFields();
    if (validationError) return setErrorMsg(validationError);

    setIsLoading(true);
    try {
      if (isSignup) {
        await signupUser();
      } else {
        await loginUser();
      }
    } catch (err) {
       setErrorMsg(err.response?.data?.message || "Something went wrong");
     } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async () => {
    const { emailId, password } = formData;
    const response = await axios.post(
      `${BASE_URL}/login`,
      { emailId, password },
      { withCredentials: true }
    );
    dispatch(loginSuccess(response.data.user));
    navigate("/");
   };

  const signupUser = async () => {
    const { firstName, lastName, emailId, password, location } = formData;
    await axios.post(`${BASE_URL}/signup`, {
      firstName,
      lastName,
      emailId,
      password,
      location,
    });
     setIsSignup(false);
  };

  return (
    <div className="min-h-[85vh] md:min-h-screen bg-gray-900 flex flex-col lg:flex-row">
      {/* Left Info Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 items-center justify-center p-12">
        <div className="max-w-lg space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">DevTinder</h1>
              <p className="text-gray-400 text-sm">Networking Platform for Developers</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white">Connect. Collaborate. Grow.</h2>
          <p className="text-gray-300 text-lg">
            DevTinder helps developers connect with like-minded professionals based on skills, interests, and goals.
          </p>
          <div className="grid grid-cols-2 gap-4 text-gray-300">
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

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center">
            <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center mr-2">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white">DevTinder</h1>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignup ? "Create an Account" : "Sign In"}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {isSignup ? "Signup to join the network." : "Login to explore connections."}
            </p>

            <div className="space-y-4">
              {isSignup && (
                <>
                  <InputField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
                  <InputField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} />
                </>
              )}
              <InputField name="emailId" label="Email" icon={<Mail />} value={formData.emailId} onChange={handleChange} />
              <InputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={<Lock />}
                rightIcon={showPassword ? <EyeOff /> : <Eye />}
                onRightIconClick={() => setShowPassword((prev) => !prev)}
                value={formData.password}
                onChange={handleChange}
              />
              {isSignup && (
                <InputField name="location" label="Location" icon={<Globe />} value={formData.location} onChange={handleChange} />
              )}

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
              >
                {isLoading ? (isSignup ? "Signing up..." : "Signing in...") : isSignup ? "Sign Up" : "Sign In"}
              </button>

              {!isSignup && (
                <button
                  onClick={() => alert("Redirecting to GitHub OAuth...")}
                  className="w-full flex items-center justify-center border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md"
                >
                  <Github className="w-4 h-4 mr-2" /> Sign in with GitHub
                </button>
              )}

              <p className="text-center text-gray-400 text-sm mt-6">
                {isSignup ? (
                  <>Already have an account? <button className="text-blue-400 hover:underline" onClick={() => setIsSignup(false)}>Sign in</button></>
                ) : (
                  <>Don’t have an account? <button className="text-blue-400 hover:underline" onClick={() => setIsSignup(true)}>Sign up free</button></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ name, label, icon, rightIcon, onRightIconClick, value, onChange, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-300 font-medium">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full bg-gray-700 text-white rounded-md ${icon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {rightIcon}
        </button>
      )}
    </div>
  </div>
);

export default Login;
