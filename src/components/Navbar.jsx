import React from "react";
import { PiLinktreeLogo } from "react-icons/pi";

const Navbar = () => {
  return (
    <div className="navbar bg-base-300 shadow-sm px-7 z-50 relative">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <PiLinktreeLogo className="text-2xl mr-2" />
          Dev<span className="text-purple-400">Tinder</span>
        </a>
      </div>

      {/* Dropdown Avatar */}
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="User avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
