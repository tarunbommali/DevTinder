import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>Go to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
