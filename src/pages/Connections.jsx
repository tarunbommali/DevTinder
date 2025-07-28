import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();

  const connections = useSelector((state) => state.connection || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isFetched = useRef(false); // flag

  const [actionMessage, setActionMessage] = useState("");

  const CONNECTION_ENDPOINT = `${BASE_URL}/user/connections`;

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CONNECTION_ENDPOINT, {
        withCredentials: true,
      });

      const users = response.data.data;
      if (Array.isArray(users)) {
        dispatch(addConnections(users));
      } else {
        dispatch(addConnections([]));
      }
    } catch (err) {
      setError("Failed to fetch connections.");
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this connection?"
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/user/connection/remove/${userId}`,
        {
          withCredentials: true,
        }
      );
      setActionMessage(response.data.message || "Connection removed.");
      fetchConnections(); // refresh the list
    } catch (err) {
      console.error("Error removing connection:", err.message);
      setActionMessage("Failed to remove connection.");
    }
  };

  const handleMessage = (userId) => {
    console.log("Message to user:", userId);
    // navigate(`/chat/${userId}`); // optional routing
  };

  useEffect(() => {
    if (!isFetched.current && (!connections || connections.length === 0)) {
      fetchConnections();
      isFetched.current = true;
    }
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Connections</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : connections.length === 0 ? (
        <p className="text-gray-600">You have no connections yet.</p>
      ) : (
        <ul className="space-y-4">
          {connections.map((user) => (
            <li
              key={user._id}
              className="bg-white shadow rounded flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg text-[#15191e]">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMessage(user._id)}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                >
                  Message
                </button>
                <button
                  onClick={() => handleRemove(user._id)}
                  className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {actionMessage && (
        <div className="mt-4 text-green-600 font-semibold">{actionMessage}</div>
      )}
    </div>
  );
};

export default Connections;
