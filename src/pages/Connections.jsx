import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      if (res.data?.data) {
        dispatch(addConnections(res.data.data));
      }
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 px-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl sm:text-3xl font-bold">No Connections Yet</h2>
          <p className="text-gray-300">Start connecting with developers to grow your network.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Your Connections
          </h1>
          <p className="text-gray-300 text-lg">
            {connections.length} active {connections.length === 1 ? "connection" : "connections"}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => {
            const { _id, firstName, lastName, profilePicture, age, gender, about } = connection;
            console.log(connection)
            return (
              <div
                key={_id}
                className="relative group bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-purple-400/50"
              >
                {/* Image */}
                <div className="flex justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={profilePicture}
                      alt={`${firstName} ${lastName}`}
                      className="rounded-full w-full h-full object-cover border-4 border-white/20 group-hover:border-purple-400 transition-all"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=7e22ce&color=fff`;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                </div>

                {/* Name + Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {firstName} {lastName}
                  </h3>
                  {age && gender && (
                    <div className="mt-1 flex justify-center gap-2 text-sm text-purple-200">
                      <span>{age} yrs</span>
                      <span className="capitalize">{gender}</span>
                    </div>
                  )}
                </div>

                {/* About */}
                {about && (
                  <p className="mt-3 text-sm text-gray-300 text-center line-clamp-3">
                    {about}
                  </p>
                )}

                {/* Chat Button */}
                <div className="mt-6">
                  <Link to={`/chat/${_id}`} className="block">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2.5 rounded-xl transition-transform transform hover:scale-105">
                      Start Chat
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">Keep building meaningful connections 🤝</p>
        </div>
      </div>
    </div>
  );
};

export default Connections;
