/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Footer from "./Footer";
import LanguageModal from "./LanguageModal";
import { BASE_URL } from "../utils/constants";
import { addUser, setAuthChecked } from "../utils/userSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userState = useSelector((state) => state?.user);
  const userData = userState?.user || (userState?.firstName ? userState : null);
  const isAuthChecked = userState?.isAuthChecked;

  const themeMode = useSelector((state) => state.theme?.mode || "dark");

  const fetchUser = async () => {
    if (userData) {
      dispatch(setAuthChecked(true));
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      const userObj = res.data?.user || res.data?.data || res.data;
      dispatch(addUser(userObj));
    } catch (err) {
      dispatch(setAuthChecked(true));
      if (err?.response?.status === 401 || err?.response?.status === 403 || err?.status === 401) {
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
      console.error("Auth status error:", err?.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0A0A] text-[#F5EFE6]">
      <Navbar />
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
      <Footer />
      <LanguageModal />
    </div>
  );
};

export default Layout;
