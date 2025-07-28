import React, { useState, useRef, useEffect } from "react";
import { PiLinktreeLogo } from "react-icons/pi";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { LogOut, User, Users } from "lucide-react"; // optional icons
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/userSlice";

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
];

const Navbar = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      closeDropdown();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm px-7 z-50 relative">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          <PiLinktreeLogo className="text-2xl mr-2" />
          Dev<span className="text-purple-400">Tinder</span>
        </Link>
      </div>

      {user.isAuthenticated && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="btn btn-ghost btn-circle avatar"
            onClick={toggleDropdown}
          >
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                alt={user.user.firstName}
                src={
                  user.user.profilePicture || "https://via.placeholder.com/150"
                }
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 z-50 bg-[#09090b] shadow-xl rounded-xl p-4 text-center">
              {/* Close button */}
              <button
                onClick={closeDropdown}
                className="absolute top-2 right-2 text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>

              {/* User Info */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <img
                  className="w-16 h-16 rounded-full ring ring-offset-2 ring-primary"
                  src={user.user.profilePicture}
                  alt="profile"
                />
                <p className="text-lg font-semibold">
                  Hi, {user.user.firstName}!
                </p>
                <p className="text-sm text-gray-500">{user.user.emailId}</p>
              </div>

              <div className="divider my-3" />

              {/* Menu Options */}
              <ul className="space-y-2 mt-4 text-left">
                {MENU_OPTIONS.map((option) => (
                  <li key={option.label}>
                    <Link
                      to={option.path}
                      onClick={closeDropdown}
                      className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#66667d] text-sm font-medium"
                    >
                      {option.icon}
                      {option.label}
                    </Link>
                  </li>
                ))}

                <hr className="my-3 border-gray-300" />

                <button
                  onClick={() => {
                    // Dispatch logout + navigate
                    handleLogout();
                    closeDropdown();
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
