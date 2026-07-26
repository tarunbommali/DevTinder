import React, { useState, useRef, useEffect } from "react";
import { PiLinktreeLogo } from "react-icons/pi";
import { X, Languages, Moon, Sun, LogOut, User, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { toggleTheme } from "../utils/themeSlice";
import { openLangModal } from "../utils/languageSlice";

const MENU_OPTIONS = [
  {
    label: "Profile",
    path: "/profile",
    icon: <User className="w-4 h-4 mr-2" />,
  },
  {
    label: "Connections",
    path: "/connections",
    icon: <Users className="w-4 h-4 mr-2" />,
  },
  {
    label: "Requests",
    path: "/requests",
    icon: <Users className="w-4 h-4 mr-2" />,
  },
];

const Navbar = () => {
  const location = useLocation();
  const userState = useSelector((state) => state.user);
  const currentUser = userState?.user || (userState?.firstName ? userState : null);
  const themeMode = useSelector((state) => state.theme?.mode || "dark");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isLoggedIn = currentUser && (currentUser._id || currentUser.firstName) && !isLoginPage;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Auto-close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      closeDropdown();

      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#0B0A0A]/95 border-b border-[#2E2A27] px-6 py-3.5 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between select-none">
      {/* Brand Logo & Name (Redirects to Home /) */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-serif font-bold text-[#F5EFE6] tracking-wide cursor-pointer hover:opacity-90 transition active:scale-95"
      >
        <PiLinktreeLogo className="text-2xl text-[#C9A227]" />
        <span>VYBE</span>
      </Link>

      {/* Right Side Flex: Translate Icon, Theme Icon, Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Translate Icon */}
        <button
          type="button"
          onClick={() => dispatch(openLangModal())}
          title="Translate / Language"
          className="p-2 rounded-full text-[#A79C8E] hover:text-[#F5EFE6] hover:bg-[#1C1917] transition border border-[#2E2A27]/50 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <Languages className="w-4.5 h-4.5" />
        </button>

        {/* Theme Icon Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
          className="p-2 rounded-full text-[#A79C8E] hover:text-[#F5EFE6] hover:bg-[#1C1917] transition border border-[#2E2A27]/50 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          {themeMode === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-[#C9A227]" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-[#121011]" />
          )}
        </button>

        {/* Profile Avatar & Dropdown (If Logged In & Not on Login Page) */}
        {isLoggedIn && (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#C9A227]/60 overflow-hidden shadow-md transition active:scale-95 flex items-center justify-center bg-[#121011]"
              onClick={toggleDropdown}
            >
              <img
                alt={currentUser.firstName || "User"}
                src={
                  currentUser.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                }
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 z-50 bg-[#121011] border border-[#2E2A27] shadow-2xl rounded-3xl p-5 text-center space-y-4 animate-slide-down">
                {/* Close button */}
                <button
                  type="button"
                  onClick={closeDropdown}
                  className="absolute top-3.5 right-3.5 text-[#A79C8E] hover:text-[#F5EFE6] transition"
                >
                  <X size={18} />
                </button>

                {/* User Info */}
                <div className="flex flex-col items-center gap-2 pt-2">
                  <img
                    className="w-16 h-16 rounded-full border-2 border-[#C9A227] object-cover shadow-md"
                    src={currentUser.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                    alt={currentUser.firstName || "profile"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#F5EFE6]">
                      Hi, {currentUser.firstName || "Member"}!
                    </h4>
                    <p className="text-xs text-[#A79C8E] truncate max-w-[220px]">{currentUser.emailId || currentUser.email}</p>
                  </div>
                </div>

                <div className="border-t border-[#2E2A27] pt-3" />

                {/* Menu Options */}
                <ul className="space-y-1.5 text-left">
                  {MENU_OPTIONS.map((option) => (
                    <li key={option.label}>
                      <Link
                        to={option.path}
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-2.5 rounded-2xl hover:bg-[#1C1917] text-[#D8CFC2] hover:text-[#F5EFE6] text-xs font-semibold transition"
                      >
                        {option.icon}
                        {option.label}
                      </Link>
                    </li>
                  ))}

                  <li className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        closeDropdown();
                      }}
                      className="flex items-center justify-center w-full px-4 py-2.5 rounded-2xl bg-[#1C1917] hover:bg-red-950/40 text-[#B85C50] border border-[#2E2A27] text-xs font-bold transition active:scale-95"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
