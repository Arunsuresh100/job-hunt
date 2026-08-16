import React, { useState, useRef, useEffect } from 'react';
import { User, GraduationCap, Calendar, Sparkles, Check, Upload, FileText, ArrowRight, X, ShieldCheck, ChevronDown, AlertCircle, Edit3 } from 'lucide-react';
import { parseResumeText } from '../utils/resumeHelper';

const DEGREE_OPTIONS = [
  'MCA (Master of Computer Applications)',
  'B.Tech / B.E. (Computer Science / IT)',
  'BCA (Bachelor of Computer Applications)',
  'M.Tech / M.E. (Computer Science)',
  'B.Sc Computer Science',
  'Other Graduate / Engineering Degree'
];

const PASSING_YEAR_OPTIONS = ['2026', '2025', '2024'];

const OnboardingModal = ({ isOpen, onClose, onSaveProfile, initialProfile = null }) => {
  // If initialProfile exists, default to 'view' mode, otherwise 'edit'
  const [viewMode, setViewMode] = useState(initialProfile ? 'view' : 'edit');
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [highestEducation, setHighestEducation] = useState(initialProfile?.highestEducation || DEGREE_OPTIONS[0]);
  const [yearOfPassing, setYearOfPassing] = useState(initialProfile?.yearOfPassing || '2026');
  const [resumeText, setResumeText] = useState(initialProfile?.resumeText || '');
  const [fileName, setFileName] = useState(initialProfile?.fileName || '');
  const [extractedSkills, setExtractedSkills] = useState(initialProfile?.skills || []);
  const [parsingResume, setParsingResume] = useState(false);
  const [parsedMessage, setParsedMessage] = useState('');
  
  // Custom dropdown & validation error state
  const [eduDropdownOpen, setEduDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const eduDropdownRef = useRef(null);

  // Sync state if initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.fullName || '');
      setHighestEducation(initialProfile.highestEducation || DEGREE_OPTIONS[0]);
      setYearOfPassing(initialProfile.yearOfPassing || '2026');
      setResumeText(initialProfile.resumeText || '');
      setFileName(initialProfile.fileName || '');
      setExtractedSkills(initialProfile.skills || []);
      setViewMode('view');
    } else {
      setViewMode('edit');
    }
  }, [initialProfile, isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eduDropdownRef.current && !eduDropdownRef.current.contains(event.target)) {
        setEduDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setParsingResume(true);
    setParsedMessage('');

    const reader = new FileReader();

    reader.onload = (event) => {
      const rawText = event.target.result || '';
      
      const isPlainText = file.type === 'text/plain' || file.name.endsWith('.txt');
      if (isPlainText) {
        setResumeText(rawText);
      } else {
        setResumeText((prev) => (prev && !prev.startsWith('%PDF') ? prev : ''));
      }

      // Auto-extract skills using helper
      const extracted = parseResumeText(rawText);
      if (extracted.skills && extracted.skills.length > 0) {
        setExtractedSkills(extracted.skills);
        setParsedMessage(`Extracted ${extracted.skills.length} skills from resume`);
      } else {
        setParsedMessage('Resume attached successfully');
      }
      setParsingResume(false);
    };

    reader.onerror = () => {
      setParsingResume(false);
      setParsedMessage('Resume file attached');
    };

    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      setValidationError('Please enter your full name');
      return;
    }

    setValidationError('');
    const profileData = {
      fullName: fullName.trim(),
      highestEducation,
      yearOfPassing,
      fileName,
      skills: extractedSkills.length > 0 ? extractedSkills : ['React', 'JavaScript', 'Node.js', 'SQL', 'Python'],
      resumeText,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('jobhunt_user_profile', JSON.stringify(profileData));
    onSaveProfile(profileData);
    setViewMode('view');
    onClose();
  };

  const handleNextStep = () => {
    if (!fullName.trim()) {
      setValidationError('Please enter your full name');
      return;
    }
    setValidationError('');
    setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight whitespace-nowrap truncate">
                {viewMode === 'view' ? 'Candidate Profile' : initialProfile ? 'Edit Your Profile' : 'Welcome! Setup Candidate Profile'}
              </h2>
              <p className="text-[11px] text-zinc-400 truncate">
                {viewMode === 'view' ? 'Your saved education & resume details' : 'Personalized fresher IT job recommendations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicator (Only in Edit Mode) */}
        {viewMode === 'edit' && (
          <div className="px-6 pt-4 pb-2 bg-zinc-950 flex items-center justify-between border-b border-zinc-900">
            <div className="flex items-center space-x-2 w-full">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
            </div>
            <span className="text-[11px] font-mono text-zinc-400 ml-3 whitespace-nowrap">
              Step {step} of 2
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
          
          {/* VIEW MODE: Professional Profile Card */}
          {viewMode === 'view' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Profile Header Avatar Banner */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                  {fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-extrabold text-white truncate">{fullName || 'Candidate'}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      Active Profile
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">
                    {yearOfPassing} Graduate • IT Candidate
                  </p>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Education */}
                <div className="p-3.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Highest Education</span>
                  </span>
                  <p className="text-xs font-semibold text-white truncate">{highestEducation}</p>
                </div>

                {/* Year of Passing */}
                <div className="p-3.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Year of Passing</span>
                  </span>
                  <p className="text-xs font-semibold text-emerald-400 font-mono">{yearOfPassing} Batch</p>
                </div>
              </div>

              {/* Resume File Status Card */}
              <div className="p-3.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-zinc-400 block">Resume Status</span>
                    <span className="text-xs font-semibold text-white truncate block">
                      {fileName || (resumeText ? 'Resume Attached' : 'No Resume Uploaded')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('edit');
                    setStep(2);
                  }}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors flex-shrink-0"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          {/* EDIT MODE: Setup Form */}
          {viewMode === 'edit' && (
            <>
              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-2.5 px-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px] sm:text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center space-x-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="truncate whitespace-nowrap">{validationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValidationError('')}
                    className="p-0.5 text-rose-400 hover:text-white transition-colors ml-2 flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 1: Personal Info & Education */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      placeholder="e.g. Arun Suresh"
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Year of Passing</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PASSING_YEAR_OPTIONS.map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setYearOfPassing(yr)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            yearOfPassing === yr
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Dropdown for Highest Education */}
                  <div className="relative" ref={eduDropdownRef}>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Highest Education</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setEduDropdownOpen(!eduDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white flex items-center justify-between transition-all focus:outline-none"
                    >
                      <span className="font-semibold text-zinc-200 truncate">{highestEducation}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${eduDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                    </button>

                    {eduDropdownOpen && (
                      <div className="absolute left-0 right-0 bottom-full mb-1.5 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                        {DEGREE_OPTIONS.map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => {
                              setHighestEducation(deg);
                              setEduDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between ${
                              highestEducation === deg
                                ? 'bg-emerald-500/10 text-emerald-300 font-bold'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{deg}</span>
                            {highestEducation === deg && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-2" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Resume Ingestion */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Resume (PDF / TXT / DOC)</span>
                    </label>
                    
                    <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 text-center bg-zinc-900/40 transition-colors relative cursor-pointer group">
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          Click or drag & drop resume here
                        </span>
                        
                        <span className="text-[11px] text-zinc-400 whitespace-nowrap truncate max-w-full">
                          Auto-extracts skills & enhances match score
                        </span>

                        {fileName && (
                          <div className="mt-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center space-x-1.5 truncate max-w-full">
                            <FileText className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{fileName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {parsedMessage && !parsingResume && (
                      <div className="mt-2.5 p-2 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] font-semibold flex items-center space-x-1.5 animate-in fade-in duration-150">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate whitespace-nowrap">{parsedMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
          {viewMode === 'view' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setViewMode('edit');
                  setStep(1);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-md hover:bg-emerald-400 transition-all"
              >
                Close
              </button>
            </>
          ) : (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setValidationError('');
                    setStep(step - 1);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:text-white"
                >
                  Back
                </button>
              ) : (
                initialProfile ? (
                  <button
                    type="button"
                    onClick={() => setViewMode('view')}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                ) : <div />
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs shadow-md hover:bg-zinc-200 transition-all flex items-center space-x-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Profile</span>
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default OnboardingModal;
