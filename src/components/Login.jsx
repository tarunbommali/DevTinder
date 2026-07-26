import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  PartyPopper,
  Users,
  Globe,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { autoDetectLocation } from "../utils/location";

const Login = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    if (isSignup && (!firstName || !lastName))
      return "Full name is required for signup.";
    return "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    const validationError = validateFields();
    if (validationError) return setErrorMsg(validationError);

    setIsLoading(true);
    try {
      if (isSignup) {
        await handleSignUp();
      } else {
        await handleLogin();
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const { emailId, password } = formData;
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Login failed");
    }
  };

  const capitalize = (str) => {
    if (!str || typeof str !== "string") return "";
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const handleSignUp = async () => {
    const { firstName, lastName, emailId, password } = formData;
    const formattedFirstName = capitalize(firstName);
    const formattedLastName = capitalize(lastName);

    try {
      const detectedLocation = await autoDetectLocation();
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: formattedFirstName,
          lastName: formattedLastName,
          emailId,
          password,
          location: detectedLocation,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "717652758838-sample.apps.googleusercontent.com",
          callback: async (response) => {
            try {
              const res = await axios.post(
                BASE_URL + "/google-login",
                { credential: response.credential },
                { withCredentials: true }
              );
              dispatch(addUser(res.data));
              navigate(isSignup ? "/profile" : "/");
            } catch (err) {
              setErrorMsg(
                err?.response?.data?.message || "Google Authentication failed"
              );
            } finally {
              setIsLoading(false);
            }
          },
        });

        window.google.accounts.id.prompt((notification) => {
          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment()
          ) {
            promptGoogleFallback();
          }
        });
      } else {
        promptGoogleFallback();
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Google sign-in error");
      setIsLoading(false);
    }
  };

  const promptGoogleFallback = async () => {
    const userEmail = prompt(
      "Enter your Google Account email to sign in / sign up with Google:"
    );
    if (!userEmail) {
      setIsLoading(false);
      return;
    }
    const nameParts = userEmail.split("@")[0].split(".");
    const firstName = nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      : "Google";
    const lastName = nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
      : "User";

    try {
      const res = await axios.post(
        BASE_URL + "/google-login",
        {
          userInfo: {
            email: userEmail,
            firstName,
            lastName,
            picture:
              "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate(isSignup ? "/profile" : "/");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Google Sign-In failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [stats, setStats] = useState({ activeUsers: 50, countryCount: 10 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(BASE_URL + "/stats");
        if (res.data) {
          setStats({
            activeUsers: res.data.activeUsers || res.data.totalUsers || 1,
            countryCount: res.data.countryCount || 1,
          });
        }
      } catch (err) {
        console.log("Failed to load app stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0A0A] text-[#F5EFE6] flex flex-col lg:flex-row select-none">
      {/* Left Info Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0A0A] border-r border-[#2E2A27] items-center justify-center p-12 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg space-y-8 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227] flex items-center justify-center text-[#121011] shadow-lg shadow-[#C9A227]/20">
              <PartyPopper className="w-6 h-6 text-[#121011]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#F5EFE6] tracking-tight">VYBE</h1>
              <p className="text-[#A79C8E] text-xs font-medium uppercase tracking-wider">
                Value Your Best Experience
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#F5EFE6] tracking-tight leading-tight">
              Find Your VYBE.
            </h2>
            <p className="text-[#A79C8E] text-base leading-relaxed">
              Meet people who share your interests, values, and lifestyle. Every connection starts with the right vibe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#121011] border border-[#2E2A27] rounded-2xl p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-[#C9A227]" />
              <span className="text-xs font-semibold text-[#D8CFC2]"> 12,000+ Connections</span>
            </div>
            <div className="bg-[#121011] border border-[#2E2A27] rounded-2xl p-4 flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#C9A227]" />
              <span className="text-xs font-semibold text-[#D8CFC2]">15+ Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#0B0A0A]">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A227] flex items-center justify-center text-[#121011] shadow-md">
              <PartyPopper className="w-5 h-5 text-[#121011]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#F5EFE6]">VYBE</h1>
          </div>

          <div className="bg-[#121011] p-8 rounded-3xl border border-[#2E2A27] shadow-2xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#F5EFE6] mb-1.5">
                {isSignup ? "Join the VYBE." : "Welcome Back 👋"}
              </h2>
              <p className="text-xs text-[#A79C8E] leading-relaxed">
                {isSignup
                  ? "Create your profile and start meeting people who genuinely match your interests and personality."
                  : "Continue your journey and discover people who match your VYBE."}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <InputField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
              <InputField
                name="emailId"
                label="Email"
                icon={<Mail className="w-4 h-4" />}
                value={formData.emailId}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <InputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="w-4 h-4" />}
                rightIcon={showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onRightIconClick={() => setShowPassword((prev) => !prev)}
                value={formData.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-[#B85C50]/30 text-[#B85C50] text-xs font-semibold text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C9A227] hover:bg-[#D9B84A] text-[#121011] font-bold py-3.5 rounded-full transition text-sm shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading
                  ? isSignup
                    ? "Joining VYBE..."
                    : "Connecting..."
                  : isSignup
                    ? "Join VYBE →"
                    : "Continue →"}
              </button>
            </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2E2A27]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-extrabold">
                  <span className="bg-[#121011] px-3 text-[#5C5650]">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center border border-[#2E2A27] bg-[#1C1917] hover:bg-[#24201E] text-[#F5EFE6] py-3 rounded-full text-xs font-semibold transition active:scale-95"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isSignup ? "Sign up with Google" : "Sign in with Google"}
              </button>

              <p className="text-center text-[#A79C8E] text-xs pt-2">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-[#C9A227] hover:underline font-semibold ml-1"
                      onClick={() => setIsSignup(false)}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="text-[#C9A227] hover:underline font-semibold ml-1"
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

const InputField = ({
  name,
  label,
  icon,
  rightIcon,
  onRightIconClick,
  value,
  onChange,
  onKeyDown,
  type = "text",
}) => (
  <div className="space-y-1">
    <label className="text-xs text-[#D8CFC2] font-medium block">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#A79C8E]">
          {icon}
        </span>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={label}
        className={`w-full bg-[#1C1917] text-[#F5EFE6] placeholder-[#5C5650] rounded-xl ${icon ? "pl-10" : "pl-4"
          } ${rightIcon ? "pr-10" : "pr-4"} py-2.5 border border-[#2E2A27] focus:outline-none focus:border-[#C9A227] text-xs transition`}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#A79C8E] hover:text-[#F5EFE6] transition"
        >
          {rightIcon}
        </button>
      )}
    </div>
  </div>
);

export default Login;
