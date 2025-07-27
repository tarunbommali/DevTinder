import React, { useState, useRef, useEffect } from "react";
import { PiLinktreeLogo } from "react-icons/pi";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state.user);
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

  return (
    <div className="navbar bg-base-300 shadow-sm px-7 z-50 relative">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <PiLinktreeLogo className="text-2xl mr-2" />
          Dev<span className="text-purple-400">Tinder</span>
        </a>
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
                src={user.user.profilePicture || "https://via.placeholder.com/150"}
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 z-50 bg-base-100 shadow-xl rounded-xl p-4 text-center">
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
                <p className="text-lg font-semibold">Hi, {user.user.firstName}!</p>
                <p className="text-sm text-gray-500">{user.user.emailId}</p>
                <button className="btn btn-outline btn-sm mt-2">
                  Manage your Account
                </button>
              </div>

              <div className="divider my-3" />

              {/* Menu Options */}
              <ul className="text-left space-y-1">
                <li>
                  <a className="hover:bg-[#15191e] p-2 rounded-md block">Profile</a>
                </li>
                <li>
                  <a className="hover:bg-[#15191e] p-2 rounded-md block">Settings</a>
                </li>
                <li>
                  <a className="hover:bg-[#15191e] p-2 rounded-md block text-red-500">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
