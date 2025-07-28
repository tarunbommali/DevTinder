import React from "react";
import { useSelector } from "react-redux";
import { User  } from "lucide-react";
import { selectUser } from "../utils/userSelectors";
import UserCard from "../components/UserCard";
import withProfileActions from '../hocs/withProfileActions';
 
const UserCardWithActions = withProfileActions(UserCard);

const Profile = () => {
  const user = useSelector(selectUser);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center border border-white/20">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            User Not Found
          </h2>
          <p className="text-slate-500">Please check your authentication status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8">
          <UserCardWithActions
            currentDev={user}
            dragOffset={{ x: 0, y: 0 }}
            rotation={0}
            opacity={1}
            isDragging={false}
            handleTouchStart={() => {}}
            handleTouchMove={() => {}}
            handleTouchEnd={() => {}}
            isOwnProfile={true} 
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
