/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { loginSuccess, logout } from "../utils/userSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserData = useSelector((state) => state.user.user);

  const fetchUserData = async () => {
    console.log("FETCHING................")
    try {
      const { data } = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      console.log("feed:"+ data)
      if (data?.user) {
        dispatch(loginSuccess(data.user));
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);

      if (error.response?.status === 401) {
        dispatch(logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
