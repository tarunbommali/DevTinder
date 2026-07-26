import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Check, Globe, Sparkles } from 'lucide-react';
import { setLanguage, closeLangModal } from '../utils/languageSlice';

const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', native: 'English', available: true },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español', available: false },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français', available: false },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch', available: false },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिंदी', available: false },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語', available: false },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文', available: false },
];

const LanguageModal = () => {
  const dispatch = useDispatch();
  const { lang, isModalOpen } = useSelector((state) => state.language || { lang: 'en', isModalOpen: false });
  const [toastMsg, setToastMsg] = useState('');

  if (!isModalOpen) return null;

  const handleSelectLang = (langItem) => {
    if (langItem.available) {
      dispatch(setLanguage(langItem.code));
      dispatch(closeLangModal());
    } else {
      setToastMsg(`🌐 Translation for ${langItem.name} (${langItem.native}) is coming soon!`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => dispatch(closeLangModal())}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[#121011] border border-[#2E2A27] rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-in z-10 text-[#F5EFE6]">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#F5EFE6]">Select Language</h3>
              <p className="text-[11px] text-[#A79C8E]">Choose your preferred language</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeLangModal())}
            className="text-[#A79C8E] hover:text-[#F5EFE6] transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert for Coming Soon */}
        {toastMsg && (
          <div className="p-3 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#C9A227] text-xs font-semibold text-center animate-slide-in flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Language Options List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {LANGUAGES.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectLang(item)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#1C1917] border-[#C9A227] shadow-md'
                    : item.available
                    ? 'bg-[#1C1917]/70 border-[#2E2A27] hover:border-[#C9A227]/50 text-[#F5EFE6]'
                    : 'bg-[#1C1917]/30 border-[#2E2A27]/40 text-[#A79C8E] opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{item.flag}</span>
                  <div>
                    <span className="text-sm font-semibold block text-[#F5EFE6]">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#A79C8E] block">{item.native}</span>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#121011] flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : !item.available ? (
                    <span className="text-[10px] font-semibold text-[#A79C8E] bg-[#2E2A27]/60 px-2 py-0.5 rounded-full border border-[#2E2A27]">
                      Coming Soon
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
