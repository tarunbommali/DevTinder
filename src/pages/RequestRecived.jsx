import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const RequestReceived = () => {
  const [requests, setRequests] = useState([]); // Make sure it's an array
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const CONNECTION_RECEIVE_ENDPOINT = `${BASE_URL}/user/requests/received`;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(CONNECTION_RECEIVE_ENDPOINT, {
        withCredentials: true,
      });

      // Log the response to confirm structure
      console.log("Received Requests:", response.data);

    
    const requestsArray = Array.isArray(response.data.data) ? response.data.data : [];
    setRequests(requestsArray);
    } catch (error) {
      console.error("Error fetching received requests:", error.message);
      setRequests([]); // fallback to empty array to avoid crash
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/accepted/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message);
      fetchRequests(); // refresh
    } catch (error) {
      console.error("Error accepting request:", error.message);
    }
  };
const handleReject = async (requestId) => {
    try {
      const REVIEW_ENDPOINT = `${BASE_URL}/request/review/rejected/${requestId}`;
      const response = await axios.post(REVIEW_ENDPOINT, {}, { withCredentials: true });
      setActionMessage(response.data.message);
      fetchRequests(); // refresh
    } catch (error) {
      console.error("Error accepting request:", error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
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
              <div>
                <p className="font-semibold">
                  {req.fromUserId?.firstName || "Unknown"}{" "}
                  {req.fromUserId?.lastName || ""}
                </p>
                <p className="text-sm text-gray-500">Status: {req.status}</p>
              </div>
              <button
                onClick={() => handleAccept(req._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Accept
              </button>
                <button
                onClick={() => handleReject(req._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Reject
              </button>
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
