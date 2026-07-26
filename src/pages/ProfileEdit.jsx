import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Camera, Upload, X, ChevronRight, ChevronLeft, Check, Heart, MapPin, Calendar,
  User, Sparkles, Users, Zap, Eye, GraduationCap, Ruler, Wine,
  Cigarette, Dumbbell, Dog, Briefcase, Globe, Church, Search, Save,
  ArrowLeft, Edit3, Pencil, Music, Film, Coffee, Book, Gamepad, Mountain,
  Camera as CameraIcon, Code, Palette, PenTool, Bike, Mic,
} from 'lucide-react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import { autoDetectLocation } from '../utils/location';
import UserCard from '../components/UserCard';
import withProfileActions from '../hocs/withProfileActions';

const UserCardWithActions = withProfileActions(UserCard);

// ─── Constants ───────────────────────────────────────────────

const INTERESTS = [
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'gym', label: 'Fitness', emoji: '💪' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'dogs', label: 'Dogs', emoji: '🐶' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'netflix', label: 'Netflix', emoji: '📺' },
  { id: 'chess', label: 'Chess', emoji: '♟️' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'dancing', label: 'Dancing', emoji: '💃' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'coding', label: 'Coding', emoji: '💻' },
  { id: 'podcasts', label: 'Podcasts', emoji: '🎙️' },
];

const LANGUAGES = [
  { id: 'english', label: 'English', flag: '🇬🇧' },
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'french', label: 'French', flag: '🇫🇷' },
  { id: 'german', label: 'German', flag: '🇩🇪' },
  { id: 'mandarin', label: 'Mandarin', flag: '🇨🇳' },
  { id: 'hindi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'tamil', label: 'Tamil', flag: '🇮🇳' },
  { id: 'telugu', label: 'Telugu', flag: '🇮🇳' },
  { id: 'bengali', label: 'Bengali', flag: '🇮🇳' },
  { id: 'urdu', label: 'Urdu', flag: '🇵🇰' },
  { id: 'arabic', label: 'Arabic', flag: '🇸🇦' },
];

const RELATIONSHIP_GOALS = ['Friendship', 'Dating', 'Long-term', 'Marriage', 'Networking', 'Not sure'];
const DRINKING_OPTS = ['Never', 'Socially', 'Sometimes', 'Often'];
const SMOKING_OPTS = ['Non-Smoker', 'Occasionally', 'Regularly'];
const WORKOUT_OPTS = ['Never', 'Sometimes', 'Regularly', 'Every day'];
const PETS_OPTS = ['Dog', 'Cat', 'Both', 'None', 'Love all'];
const RELIGION_OPTS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jewish', 'Atheist', 'Spiritual', 'Prefer not to say'];
const GENDER_OPTS = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
const INTERESTED_IN_OPTS = ['Male', 'Female', 'Everyone'];

// ─── Styles ──────────────────────────────────────────────────

const ROW_CLS =
  "w-full flex items-center justify-between gap-3 bg-[#1C1917] hover:bg-[#221E1B] border border-[#2E2A27] rounded-2xl px-4 py-4 text-left transition-all duration-200";

const SECTION_LABEL_CLS = "text-[11px] font-bold text-[#A79C8E] uppercase tracking-wider mb-3 px-1";

const SHEET_CHIP_CLS = (active) =>
  `px-4 py-2.5 rounded-full border font-medium transition-all duration-200 text-sm ${active
    ? 'bg-[#C9A227]/15 border-[#C9A227] text-[#C9A227] shadow-[0_0_20px_rgba(201,162,39,0.1)]'
    : 'bg-[#1C1917] border-[#2E2A27] text-[#D8CFC2] hover:border-[#4A443E] hover:bg-[#221E1B]'
  }`;

// ─── Components ──────────────────────────────────────────────

const Row = ({ icon: Icon, label, value, onClick, rightElement }) => (
  <button type="button" onClick={onClick} className={ROW_CLS}>
    <span className="flex items-center gap-3 min-w-0">
      <Icon className="w-4.5 h-4.5 text-[#A79C8E] shrink-0" />
      <span className="text-sm font-medium text-[#F5EFE6]">{label}</span>
    </span>
    <span className="flex items-center gap-2 min-w-0 max-w-[55%]">
      {rightElement ? (
        rightElement
      ) : (
        <>
          <span className="text-sm text-[#A79C8E] truncate">{value || 'Add'}</span>
          <ChevronRight className="w-4 h-4 text-[#5C5650] shrink-0" />
        </>
      )}
    </span>
  </button>
);

// ─── Sheet Component ─────────────────────────────────────────

const Sheet = ({ title, subtitle, count, total, onClose, children, showProgress }) => (
  <div className="absolute inset-0 z-50 flex items-end justify-center rounded-3xl overflow-hidden">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-h-[88%] bg-[#121011] border-t border-[#2E2A27] rounded-t-3xl shadow-2xl flex flex-col animate-slide-up z-10">
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-[#3A342F]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-1">
        <button onClick={onClose} className="text-[#A79C8E] hover:text-[#F5EFE6] transition">
          <X className="w-5 h-5" />
        </button>
        <button onClick={onClose} className="text-sm font-bold text-[#C9A227] hover:text-[#D9B84A] transition">
          Done
        </button>
      </div>

      {/* Title */}
      <div className="px-5 pt-2 pb-1">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[24px] font-semibold text-[#F5EFE6]">{title}</h2>
          {total ? <span className="text-xs text-[#A79C8E]">0/{total}</span> : null}
        </div>
        {subtitle && <p className="text-xs text-[#A79C8E] mt-0.5">{subtitle}</p>}
      </div>

      {/* Progress indicator */}
      {showProgress && (
        <div className="px-5 py-2">
          <div className="h-1 bg-[#2E2A27] rounded-full overflow-hidden">
            <div className="h-full bg-[#C9A227] rounded-full transition-all duration-300" style={{ width: '35%' }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────

const ProfileEdit = () => {
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(user?.location || null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [activeSheet, setActiveSheet] = useState(null);

  // ─── Location detection ────────────────────────────────────

  React.useEffect(() => {
    const initLocation = async () => {
      const loc = await autoDetectLocation();
      setDetectedLocation(loc);
    };
    initLocation();
  }, []);

  // ─── Form state ─────────────────────────────────────────────

  const [formData, setFormData] = useState({
    photos: Array.isArray(user?.photos) && user.photos.length > 0
      ? user.photos
      : user?.profilePicture ? [user.profilePicture] : [],
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || user?.emailId || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    bio: user?.bio || '',
    interests: Array.isArray(user?.interests) ? user.interests : Array.isArray(user?.skills) ? user.skills : [],
    languages: Array.isArray(user?.languages) ? user.languages : [],
    drinking: user?.drinking || '',
    smoking: user?.smoking || '',
    workout: user?.workout || '',
    pets: user?.pets || '',
    height: user?.height || '',
    occupation: user?.occupation || user?.currentRole || '',
    education: user?.education || user?.highestQualification || '',
    religion: user?.religion || '',
    interestedIn: user?.preferences?.interestedIn || ['female'],
    minAge: user?.preferences?.ageRange?.min || 18,
    maxAge: user?.preferences?.ageRange?.max || 60,
    maxDistance: user?.preferences?.maxDistance || 50,
    relationshipGoal: user?.relationshipGoal || '',
  });

  const [uploadedPhotos, setUploadedPhotos] = useState(formData.photos);

  React.useEffect(() => {
    if (!user) return;
    const initialPhotos = Array.isArray(user.photos) && user.photos.length > 0
      ? user.photos
      : user.profilePicture ? [user.profilePicture] : [];

    setUploadedPhotos(initialPhotos);
    setFormData({
      photos: initialPhotos,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || user.emailId || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender || '',
      bio: user.bio || '',
      interests: Array.isArray(user.interests) ? user.interests : Array.isArray(user.skills) ? user.skills : [],
      languages: Array.isArray(user.languages) ? user.languages : [],
      drinking: user.drinking || '',
      smoking: user.smoking || '',
      workout: user.workout || '',
      pets: user.pets || '',
      height: user.height || '',
      occupation: user.occupation || user.currentRole || '',
      education: user.education || user.highestQualification || '',
      religion: user.religion || '',
      interestedIn: user.preferences?.interestedIn || ['female'],
      minAge: user.preferences?.ageRange?.min || 18,
      maxAge: user.preferences?.ageRange?.max || 60,
      maxDistance: user.preferences?.maxDistance || 50,
      relationshipGoal: user.relationshipGoal || '',
    });
  }, [user]);

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  // ─── Toast ──────────────────────────────────────────────────

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  // ─── Photo handlers ────────────────────────────────────────

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    // Prepend newly uploaded photo so it becomes the main profile photo (index 0)
    setUploadedPhotos((prev) => {
      const updated = [...newPhotos, ...prev];
      setFormData((f) => ({ ...f, photos: updated }));
      return updated;
    });
  };

  const removePhoto = (index) => {
    if (uploadedPhotos.length <= 1) {
      showToast('error', 'Profile must have at least one photo.');
      return;
    }
    setUploadedPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData((f) => ({ ...f, photos: updated }));
      return updated;
    });
  };

  // ─── Toggle helpers ────────────────────────────────────────

  const toggleInArray = (key, id) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
      return { ...prev, [key]: updated };
    });
  };

  const toggleInterestedIn = (label) => {
    const value = label.toLowerCase();
    if (value === 'everyone') {
      set('interestedIn', ['male', 'female']);
    } else {
      setFormData((prev) => ({
        ...prev,
        interestedIn: prev.interestedIn.includes(value)
          ? prev.interestedIn.filter((i) => i !== value)
          : [...prev.interestedIn, value],
      }));
    }
  };

  const [saveStatus, setSaveStatus] = useState('saved');
  const isInitialMount = useRef(true);

  // ─── Auto Save ─────────────────────────────────────────────

  const autoSave = async (currentForm, currentPhotos) => {
    setSaveStatus('saving');
    const payload = {
      firstName: currentForm.firstName,
      lastName: currentForm.lastName || undefined,
      dateOfBirth: currentForm.dateOfBirth || undefined,
      gender: currentForm.gender,
      bio: currentForm.bio,
      height: currentForm.height ? Number(currentForm.height) : undefined,
      education: currentForm.education || undefined,
      occupation: currentForm.occupation || undefined,
      drinking: currentForm.drinking || undefined,
      smoking: currentForm.smoking || undefined,
      workout: currentForm.workout || undefined,
      pets: currentForm.pets || undefined,
      religion: currentForm.religion || undefined,
      relationshipGoal: currentForm.relationshipGoal || undefined,
      photos: currentPhotos || currentForm.photos,
      languages: currentForm.languages,
      interests: currentForm.interests,
      location: detectedLocation || user.location || "Earth",
      profileCompleted: true,
      preferences: {
        interestedIn: currentForm.interestedIn,
        ageRange: { min: Number(currentForm.minAge) || 18, max: Number(currentForm.maxAge) || 60 },
        maxDistance: Number(currentForm.maxDistance) || 50,
      },
    };

    try {
      const res = await axios.put(`${BASE_URL}/profile/edit`, payload, { withCredentials: true });
      dispatch(addUser(res?.data?.user || res?.data));
      setSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save error:', error.message);
      setSaveStatus('saved');
    }
  };

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      autoSave(formData, uploadedPhotos);
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, uploadedPhotos]);

  const closeSheet = () => setActiveSheet(null);

  // ─── Chip renderers ────────────────────────────────────────

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const photoSlots = Array.from({ length: 9 }, (_, i) => uploadedPhotos[i] || null);

  const chipList = (options, value, onPick) => (
    <div className="flex flex-wrap gap-2 pt-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onPick(opt)} className={SHEET_CHIP_CLS(value === opt)}>
          {opt}
        </button>
      ))}
    </div>
  );

  const multiChipList = (options, values, idKey, labelKey, emojiKey, onToggle) => (
    <div className="flex flex-wrap gap-2 pt-2">
      {options.map((opt) => (
        <button
          key={opt[idKey]}
          type="button"
          onClick={() => onToggle(opt[idKey])}
          className={SHEET_CHIP_CLS(values.includes(opt[idKey])) + " flex items-center gap-1.5"}
        >
          {emojiKey && <span>{opt[emojiKey]}</span>}
          {opt[labelKey]}
        </button>
      ))}
    </div>
  );

  // ─── Section components ────────────────────────────────────

  const Section = ({ title, children, icon: Icon }) => (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#C9A227]" />}
        <p className={SECTION_LABEL_CLS}>{title}</p>
      </div>
      {children}
    </section>
  );

  const Row = ({ icon: Icon, label, value, onClick }) => (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-between p-3 bg-[#1C1917] hover:bg-[#221E1B] rounded-2xl border border-[#2E2A27] transition">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-[#A79C8E]" />
        <span className="text-sm text-[#F5EFE6]">{label}</span>
      </div>
      <span className="text-sm text-[#A79C8E] truncate max-w-[150px]">{value || "Add"}</span>
    </button>
  );

  const userState = useSelector((state) => state.user || {});
  const isAuthChecked = userState.isAuthChecked;

  if (isAuthChecked && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0A0A] text-[#F5EFE6] py-6 px-4 flex flex-col items-center select-none pb-28">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-sm bg-[#121011] ${toast.type === 'success'
              ? 'border-[#7A9174]/50 text-[#A9C4A2]'
              : 'border-[#B85C50]/50 text-[#E39A91]'
              }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-[#7A9174]" />
            ) : (
              <X className="w-5 h-5 text-[#B85C50]" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Main Card Container Frame */}
      <div className="w-full max-w-sm bg-[#121011] border border-[#2E2A27] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Clean Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#171415] border-b border-[#2E2A27]">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-[#A79C8E] hover:text-[#F5EFE6] transition p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-lg font-semibold text-[#F5EFE6]">Edit Profile</h1>
          <div className="w-5" />
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* PROFILE PHOTOS Flex Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-white tracking-wider uppercase">
                Profile Photos
              </h2>
              <span className="text-[11px] text-[#A79C8E]">
                {uploadedPhotos.length} / 6 photos
              </span>
            </div>

            {/* Horizontal Flex Photos Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {uploadedPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-32 rounded-2xl overflow-hidden shrink-0 bg-[#1C1917] border border-[#2E2A27] group shadow-md"
                >
                  <img
                    src={photoUrl}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  {/* Delete Photo Button */}
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    title="Remove photo"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition backdrop-blur-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Photo (+) Slot */}
              {uploadedPhotos.length < 6 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-32 rounded-2xl border-2 border-dashed border-[#2E2A27] hover:border-[#C9A227] bg-[#1C1917] flex flex-col items-center justify-center shrink-0 cursor-pointer transition group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-[#121011] flex items-center justify-center shadow-lg group-hover:scale-110 transition active:scale-95 mb-1">
                    <span className="text-xl font-bold leading-none">+</span>
                  </div>
                  <span className="text-[10px] text-[#A79C8E] group-hover:text-[#C9A227] transition font-medium">
                    Add Photo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Editable Profile Sections */}
          <div className="space-y-3 pt-3 border-t border-[#2E2A27]">
              {/* About You */}
              <Section title="About You" icon={User}>
                <Row icon={User} label="Name" value={[formData.firstName, formData.lastName].filter(Boolean).join(' ')} onClick={() => setActiveSheet('name')} />
                <Row icon={Calendar} label="Birthday" value={formData.dateOfBirth} onClick={() => setActiveSheet('dob')} />
                <Row icon={Zap} label="Gender" value={formData.gender && formData.gender[0].toUpperCase() + formData.gender.slice(1)} onClick={() => setActiveSheet('gender')} />
              </Section>

              {/* Bio */}
              <Section title="Bio" icon={Edit3}>
                <Row icon={Sparkles} label="About me" value={formData.bio ? `${formData.bio.slice(0, 30)}${formData.bio.length > 30 ? '…' : ''}` : ''} onClick={() => setActiveSheet('bio')} />
              </Section>

              {/* Relationship Goals */}
              <Section title="Relationship Goals" icon={Heart}>
                <Row icon={Eye} label="Looking for" value={formData.relationshipGoal} onClick={() => setActiveSheet('relationshipGoal')} />
              </Section>

              {/* Interests & Languages */}
              <Section title="Interests & Languages" icon={Music}>
                <Row icon={Heart} label="Interests" value={formData.interests.length ? `${formData.interests.length} selected` : ''} onClick={() => setActiveSheet('interests')} />
                <Row icon={Globe} label="Languages" value={formData.languages.length ? `${formData.languages.length} selected` : ''} onClick={() => setActiveSheet('languages')} />
              </Section>

              {/* Lifestyle */}
              <Section title="Lifestyle" icon={Wine}>
                <Row icon={Wine} label="Drinking" value={formData.drinking} onClick={() => setActiveSheet('drinking')} />
                <Row icon={Cigarette} label="Smoking" value={formData.smoking} onClick={() => setActiveSheet('smoking')} />
                <Row icon={Dumbbell} label="Workout" value={formData.workout} onClick={() => setActiveSheet('workout')} />
                <Row icon={Dog} label="Pets" value={formData.pets} onClick={() => setActiveSheet('pets')} />
                <Row icon={Church} label="Religion" value={formData.religion} onClick={() => setActiveSheet('religion')} />
              </Section>

              {/* Basics */}
              <Section title="Basics" icon={Ruler}>
                <Row icon={Ruler} label="Height" value={formData.height ? `${formData.height} cm` : ''} onClick={() => setActiveSheet('height')} />
                <Row icon={Briefcase} label="Occupation" value={formData.occupation} onClick={() => setActiveSheet('occupation')} />
                <Row icon={GraduationCap} label="Education" value={formData.education} onClick={() => setActiveSheet('education')} />
              </Section>

              {/* Preferences */}
              <Section title="Preferences" icon={Users}>
                <Row
                  icon={Users}
                  label="Interested in"
                  value={formData.interestedIn.length === 2 ? 'Everyone' : formData.interestedIn.map((v) => v[0].toUpperCase() + v.slice(1)).join(', ')}
                  onClick={() => setActiveSheet('interestedIn')}
                />
                <Row icon={Users} label="Age range" value={`${formData.minAge} - ${formData.maxAge}`} onClick={() => setActiveSheet('ageRange')} />
                <Row icon={MapPin} label="Max distance" value={`${formData.maxDistance} km`} onClick={() => setActiveSheet('distance')} />
              </Section>
            </div>
          </div>

      {/* ─── Sheets ────────────────────────────────────────────── */}

      {/* Name Sheet */}
      {activeSheet === 'name' && (
        <Sheet title="Name" onClose={closeSheet}>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-[#D8CFC2] block mb-1.5">First Name</label>
              <input
                value={formData.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#D8CFC2] block mb-1.5">Last Name</label>
              <input
                value={formData.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227] transition"
                placeholder="Your last name"
              />
            </div>
          </div>
        </Sheet>
      )}

      {/* DOB Sheet */}
      {activeSheet === 'dob' && (
        <Sheet title="Birthday" subtitle="Your birthday helps us find the right matches" onClose={closeSheet}>
          <input
            ref={dateInputRef}
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => set('dateOfBirth', e.target.value)}
            className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227] [color-scheme:dark]"
          />
          <p className="text-xs text-[#A79C8E] mt-2">You must be 18 or older to use VYBE</p>
        </Sheet>
      )}

      {/* Gender Sheet */}
      {activeSheet === 'gender' && (
        <Sheet title="Gender" total={1} onClose={closeSheet}>
          {chipList(GENDER_OPTS, formData.gender && formData.gender[0].toUpperCase() + formData.gender.slice(1), (g) => set('gender', g.toLowerCase()))}
        </Sheet>
      )}

      {/* Bio Sheet */}
      {activeSheet === 'bio' && (
        <Sheet title="About Me" subtitle="Share what makes you unique" onClose={closeSheet}>
          <textarea
            value={formData.bio}
            onChange={(e) => set('bio', e.target.value)}
            rows={6}
            placeholder="I'm passionate about..."
            className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
          />
          <p className="text-xs text-[#A79C8E] mt-1 text-right">{formData.bio.length}/500</p>
        </Sheet>
      )}

      {/* Relationship Goal Sheet */}
      {activeSheet === 'relationshipGoal' && (
        <Sheet title="Looking for" subtitle="What are you hoping to find on VYBE?" onClose={closeSheet}>
          {chipList(RELATIONSHIP_GOALS, formData.relationshipGoal, (g) => set('relationshipGoal', g))}
        </Sheet>
      )}

      {/* Interests Sheet */}
      {activeSheet === 'interests' && (
        <Sheet title="Interests" subtitle="Choose at least 3 things you love" onClose={closeSheet} showProgress>
          {multiChipList(INTERESTS, formData.interests, 'id', 'label', 'emoji', (id) => toggleInArray('interests', id))}
          <p className="text-xs text-[#A79C8E] mt-3 text-center">{formData.interests.length} selected</p>
        </Sheet>
      )}

      {/* Languages Sheet */}
      {activeSheet === 'languages' && (
        <Sheet title="Languages" subtitle="Which languages do you speak?" onClose={closeSheet}>
          {multiChipList(LANGUAGES, formData.languages, 'id', 'label', 'flag', (id) => toggleInArray('languages', id))}
          <p className="text-xs text-[#A79C8E] mt-3 text-center">{formData.languages.length} selected</p>
        </Sheet>
      )}

      {/* Drinking Sheet */}
      {activeSheet === 'drinking' && (
        <Sheet title="Drinking" onClose={closeSheet}>
          {chipList(DRINKING_OPTS, formData.drinking, (v) => set('drinking', v))}
        </Sheet>
      )}

      {/* Smoking Sheet */}
      {activeSheet === 'smoking' && (
        <Sheet title="Smoking" onClose={closeSheet}>
          {chipList(SMOKING_OPTS, formData.smoking, (v) => set('smoking', v))}
        </Sheet>
      )}

      {/* Workout Sheet */}
      {activeSheet === 'workout' && (
        <Sheet title="Workout" onClose={closeSheet}>
          {chipList(WORKOUT_OPTS, formData.workout, (v) => set('workout', v))}
        </Sheet>
      )}

      {/* Pets Sheet */}
      {activeSheet === 'pets' && (
        <Sheet title="Pets" onClose={closeSheet}>
          {chipList(PETS_OPTS, formData.pets, (v) => set('pets', v))}
        </Sheet>
      )}

      {/* Religion Sheet */}
      {activeSheet === 'religion' && (
        <Sheet title="Religion" onClose={closeSheet}>
          {chipList(RELIGION_OPTS, formData.religion, (v) => set('religion', v))}
        </Sheet>
      )}

      {/* Height Sheet */}
      {activeSheet === 'height' && (
        <Sheet title="Height" onClose={closeSheet}>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => set('height', e.target.value)}
            placeholder="175"
            className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227]"
          />
          <p className="text-xs text-[#A79C8E] mt-1">Centimeters (cm)</p>
        </Sheet>
      )}

      {/* Occupation Sheet */}
      {activeSheet === 'occupation' && (
        <Sheet title="Occupation" onClose={closeSheet}>
          <input
            value={formData.occupation}
            onChange={(e) => set('occupation', e.target.value)}
            placeholder="Student or job title"
            className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227]"
          />
        </Sheet>
      )}

      {/* Education Sheet */}
      {activeSheet === 'education' && (
        <Sheet title="Education" onClose={closeSheet}>
          <input
            value={formData.education}
            onChange={(e) => set('education', e.target.value)}
            placeholder="School or degree"
            className="w-full p-3 bg-[#1C1917] text-[#F5EFE6] border border-[#2E2A27] rounded-xl outline-none focus:ring-2 focus:ring-[#C9A227]"
          />
        </Sheet>
      )}

      {/* Interested In Sheet */}
      {activeSheet === 'interestedIn' && (
        <Sheet title="Interested In" onClose={closeSheet}>
          <div className="flex flex-wrap gap-2 pt-2">
            {INTERESTED_IN_OPTS.map((g) => {
              const active =
                (g === 'Everyone' && formData.interestedIn.length === 2) ||
                formData.interestedIn.includes(g.toLowerCase());
              return (
                <button key={g} type="button" onClick={() => toggleInterestedIn(g)} className={SHEET_CHIP_CLS(active)}>
                  {g}
                </button>
              );
            })}
          </div>
        </Sheet>
      )}

      {/* Age Range Sheet */}
      {activeSheet === 'ageRange' && (
        <Sheet title="Age Range" onClose={closeSheet}>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-[#A79C8E] block mb-1">Minimum Age: {formData.minAge}</label>
              <input
                type="range"
                min="18"
                max="60"
                value={formData.minAge}
                onChange={(e) => set('minAge', parseInt(e.target.value))}
                className="w-full accent-[#C9A227]"
              />
            </div>
            <div>
              <label className="text-xs text-[#A79C8E] block mb-1">Maximum Age: {formData.maxAge}</label>
              <input
                type="range"
                min="18"
                max="60"
                value={formData.maxAge}
                onChange={(e) => set('maxAge', parseInt(e.target.value))}
                className="w-full accent-[#C9A227]"
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-[#D8CFC2] bg-[#1C1917] p-3 rounded-xl">
              <span>{formData.minAge}</span>
              <span>—</span>
              <span>{formData.maxAge}</span>
            </div>
          </div>
        </Sheet>
      )}

      {/* Distance Sheet */}
      {activeSheet === 'distance' && (
        <Sheet title="Max Distance" onClose={closeSheet}>
          <div className="pt-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={formData.maxDistance}
                onChange={(e) => set('maxDistance', parseInt(e.target.value))}
                className="flex-1 accent-[#C9A227]"
              />
              <span className="text-lg font-semibold text-[#C9A227] min-w-[60px] text-center">{formData.maxDistance} km</span>
            </div>
            <div className="flex justify-between text-xs text-[#A79C8E] mt-1">
              <span>5 km</span>
              <span>150 km</span>
            </div>
          </div>
        </Sheet>
      )}
      </div>
    </div>
  );
};

export default ProfileEdit;