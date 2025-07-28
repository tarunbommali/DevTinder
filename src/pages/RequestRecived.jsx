/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";
import { useDispatch, useSelector } from "react-redux";

const RequestReceived = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests || []);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const CONNECTION_RECEIVE_ENDPOINT = `${BASE_URL}/user/requests/received`;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CONNECTION_RECEIVE_ENDPOINT, {
        withCredentials: true,
      });

      const requestsArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      dispatch(addRequests(requestsArray));
    } catch (error) {
      console.error("Error fetching received requests:", error.message);
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/accepted/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message);
      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error.message);
      setActionMessage("Failed to accept request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/rejected/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message);
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error.message);
      setActionMessage("Failed to reject request.");
    }
  };

  useEffect(() => {
    // ✅ Avoid fetching if already present
    if (!requests || requests.length === 0) {
      fetchRequests();
    }
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Connection Requests Received</h2>

      {loading ? (
        <p className="text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No connection requests received.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <img
                  src={req.fromUserId?.profilePicture || "/default-avatar.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {req.fromUserId?.firstName || "Unknown"}{" "}
                    {req.fromUserId?.lastName || ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {req.status}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req._id)}
                  className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req._id)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
                >
                  Reject
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

export default RequestReceived;
