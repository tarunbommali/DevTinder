import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import Input from "../components/ui/TextInput";
import TextArea from "../components/ui/TextArea";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { loginSuccess } from "../utils/userSlice";

const tabs = [
  { id: "personal", label: "Personal Info" },
  { id: "professional", label: "Professional Details" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
];

const ProfileEdit = () => {
  const user = useSelector((state) => state.user?.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const allowedFields = [
    "firstName",
    "lastName",
    "bio",
    "profilePicture",
    "skills",
    "age",
    "location",
    "gender",
    "company",
    "collegeInstitution",
    "highestQualification",
    "currentRole",
    "totalExperience",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Filter formData to only allowed fields
    const filteredData = {};
    allowedFields.forEach((key) => {
      if (formData[key] !== undefined) {
        filteredData[key] = formData[key];
      }
    });

    try {
      await axios.patch(`${BASE_URL}/profile/edit`, filteredData, {
        withCredentials: true,
      });

      dispatch(loginSuccess({ ...user, ...filteredData })); // update redux too
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-[#15191e]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 rounded-3xl shadow-2xl border border-white/30"
        >
          {/* Header Tabs + Actions */}
          <div className="flex justify-between items-center border-b border-slate-300 px-6 py-4 flex-wrap gap-2">
            <div className="flex  sm:overflow-x-auto  overflow-hidden gap-2 sm:pb-2 pb:0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 font-medium border-b-4 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-indigo-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-4 py-2 font-medium rounded-lg border border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
                  isLoading
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-green-500/25"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8 space-y-6">
            {activeTab === "personal" && (
              <>
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Profile Picture URL"
                  name="profilePicture"
                  value={formData.profilePicture || ""}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  required
                />
                <TextArea
                  label="Professional Bio"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </>
            )}

            {activeTab === "professional" && (
              <>
                <Input
                  label="Current Role"
                  name="currentRole"
                  value={formData.currentRole || ""}
                  onChange={handleChange}
                />
                <Input
                  label="Company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                />
                <Input
                  label="Total Experience"
                  name="totalExperience"
                  type="number"
                  value={formData.totalExperience || 0}
                  onChange={handleChange}
                  min={0}
                  max={50}
                />
              </>
            )}

            {activeTab === "education" && (
              <>
                <Input
                  label="Highest Qualification"
                  name="highestQualification"
                  value={formData.highestQualification || ""}
                  onChange={handleChange}
                />
                <Input
                  label="College / Institution"
                  name="collegeInstitution"
                  value={formData.collegeInstitution || ""}
                  onChange={handleChange}
                />
              </>
            )}

            {activeTab === "skills" && (
              <Input
                label="Skills (comma-separated)"
                name="skills"
                value={(formData.skills || []).join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
