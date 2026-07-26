import React from "react";
import { useSelector } from "react-redux";
import { User, Pencil, Eye } from "lucide-react";
import { selectUser } from "../utils/userSelectors";
import UserCard from "../components/UserCard";
import withProfileActions from "../hocs/withProfileActions";
import { Link, Navigate } from "react-router-dom";

const UserCardWithActions = withProfileActions(UserCard);

const Profile = () => {
  const userState = useSelector((state) => state.user || {});
  const user = selectUser({ user: userState });
  const isAuthChecked = userState.isAuthChecked;

  if (isAuthChecked && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0A0A] text-[#F5EFE6] py-8 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        {/* Live Card Preview */}
        <div className="flex justify-center">
          <UserCardWithActions
            user={user}
            dragOffset={{ x: 0, y: 0 }}
            rotation={0}
            opacity={1}
            isDragging={false}
            handleTouchStart={() => { }}
            handleTouchMove={() => { }}
            handleTouchEnd={() => { }}
            isOwnProfile={true}
          />
        </div>
      </div>
    </div >
  );
};

export default Profile;
