import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  X,
  Save,
  AlertCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Building2,
  Laptop,
  ChevronDown,
  Check,
  Filter
} from 'lucide-react';
import { fetchExams, toggleSaveItem, createExam, updateExam } from '../api/client';
import ExamCard from '../components/ExamCard';

const capitalizeText = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const Exams = ({ onUpdateSavedCount }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const catRef = useRef(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultForm = {
    name: '',
    conductingBody: '',
    category: 'Teacher & Professor Exams',
    notificationDate: new Date().toISOString().split('T')[0],
    applicationStartDate: new Date().toISOString().split('T')[0],
    applicationEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    officialUrl: '',
    description: '',
  };

  const [formData, setFormData] = useState(defaultForm);
  const [errorMsg, setErrorMsg] = useState('');

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await fetchExams({ search, category });
      if (data.success) {
        setExams(data.exams || []);
      }
    } catch (err) {
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [search, category]);

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      loadExams();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingExam(null);
    setFormData(defaultForm);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name || '',
      conductingBody: exam.conductingBody || '',
      category: exam.category || 'Teacher & Professor Exams',
      notificationDate: exam.notificationDate ? new Date(exam.notificationDate).toISOString().split('T')[0] : '',
      applicationStartDate: exam.applicationStartDate ? new Date(exam.applicationStartDate).toISOString().split('T')[0] : '',
      applicationEndDate: exam.applicationEndDate ? new Date(exam.applicationEndDate).toISOString().split('T')[0] : '',
      examDate: exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] : '',
      officialUrl: exam.officialUrl || '',
      description: exam.description || '',
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.conductingBody || !formData.applicationEndDate || !formData.officialUrl) {
      setErrorMsg('Please fill in mandatory fields: Exam Name, Conducting Body, Deadline, Official URL.');
      return;
    }

    try {
      if (editingExam) {
        await updateExam(editingExam.id, { ...formData, isUserCreated: true });
      } else {
        await createExam({ ...formData, isUserCreated: true });
      }
      setShowModal(false);
      loadExams();
    } catch (err) {
      setErrorMsg('Error saving exam: ' + err.message);
    }
  };

  const urgentCount = exams.filter((e) => e.isUrgent).length;

  const categories = [
    { label: 'All Exams', value: '' },
    { label: 'Teacher & Professor Exams', value: 'Teacher & Professor Exams' },
    { label: 'Kerala PSC & State Exams', value: 'Kerala PSC & State Exams' },
    { label: 'IT & Corporate Hiring Exams', value: 'IT & Corporate Hiring Exams' },
    { label: 'MCA & Entrance Exams', value: 'MCA & Entrance Exams' },
    { label: 'Central & SSC Exams', value: 'Central & SSC Exams' },
  ];

  const activeCategoryLabel = categories.find((c) => c.value === category)?.label || 'All Exams';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Modern Kerala Exam Hero Banner */}
      <div className="mono-panel p-4 sm:p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 relative overflow-hidden shadow-xl space-y-3.5">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header Badge & Title */}
        <div className="space-y-2 text-center sm:text-left relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[8px] text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Kerala Govt, Teaching & IT Exams</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
            Kerala Exam Tracker & Career Drive Portal
          </h1>
        </div>

        {/* 2. Image directly after Title */}
        <div className="flex items-center justify-center py-1 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-3xl blur-md group-hover:blur-lg transition-all" />
            <img
              src="/exam_illustration.png"
              alt="Kerala Exam Tracker Illustration"
              className="relative w-32 h-32 sm:w-44 sm:h-44 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* 3. Category Track Boxes directly AFTER the Image in 2 Rows */}
        <div className="space-y-2 relative z-10">
          {/* Row 1: 2 Boxes Side-by-Side */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCategory('Teacher & Professor Exams')}
              className={`p-3 rounded-xl border transition-all text-center flex items-center justify-center space-x-2 sm:space-x-2.5 min-w-0 ${
                category === 'Teacher & Professor Exams'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-bold text-white text-[11px] sm:text-xs truncate">Teacher & Professor</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('Kerala PSC & State Exams')}
              className={`p-3 rounded-xl border transition-all text-center flex items-center justify-center space-x-2 sm:space-x-2.5 min-w-0 ${
                category === 'Kerala PSC & State Exams'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="font-bold text-white text-[11px] sm:text-xs truncate">Kerala PSC Thulasi</span>
            </button>
          </div>

          {/* Row 2: 1 Full-Width Box */}
          <button
            type="button"
            onClick={() => setCategory('IT & Corporate Hiring Exams')}
            className={`w-full p-3 rounded-xl border transition-all text-center flex items-center justify-center space-x-2 sm:space-x-2.5 min-w-0 ${
              category === 'IT & Corporate Hiring Exams'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-md'
                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="font-bold text-white text-[11px] sm:text-xs truncate">IT & Corporate Hiring Exams</span>
          </button>
        </div>

        {/* 4. Action Buttons Row: 7 Closing Soon & + Add Exam */}
        <div className="flex items-center justify-center sm:justify-start space-x-2.5 pt-1 relative z-10">
          {urgentCount > 0 && (
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs capitalize whitespace-nowrap shadow-sm">
              {urgentCount} Closing Soon
            </span>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs transition-all active:scale-95 capitalize shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="whitespace-nowrap">Add Exam</span>
          </button>
        </div>
      </div>

      {/* Search & Custom Glassmorphic Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/90 shadow-xl z-40 relative">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Exams (KTET, K-SET, UGC NET, TCS NQT...)"
            className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Custom Professional Category Dropdown */}
        <div className="relative w-full sm:w-auto flex justify-end" ref={catRef}>
          <button
            type="button"
            onClick={() => setIsCatOpen(!isCatOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start space-x-2.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-zinc-400 font-normal">Category:</span>
              <span className="font-bold text-white">{activeCategoryLabel}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-1 ${
                isCatOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Floating Options Menu */}
          {isCatOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-full sm:w-72 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategory(cat.value);
                    setIsCatOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat.value
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  {category === cat.value && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-5 bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="h-10 bg-zinc-800/40 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="flex-1 w-full min-h-[300px] mono-panel p-8 text-center rounded-2xl border border-zinc-800 flex flex-col items-center justify-center space-y-3 shadow-xl">
          <GraduationCap className="w-10 h-10 text-emerald-400 mx-auto" />

          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-white capitalize">No Exam Notifications Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto capitalize">
              {search || category
                ? 'Try Adjusting Your Search Or Filter Category.'
                : 'Click "+ Add Exam" Above To Insert A New Notification.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onToggleSave={handleToggleSave}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="mono-panel w-full max-w-lg p-5 rounded-2xl border border-zinc-700 bg-zinc-950 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white capitalize">
                {editingExam ? 'Edit Exam Notification' : 'Add Exam Notification'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono capitalize">Exam Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kerala State Eligibility Test (K-SET 2026)"
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Conducting Body *</label>
                  <input
                    type="text"
                    value={formData.conductingBody}
                    onChange={(e) => setFormData({ ...formData, conductingBody: e.target.value })}
                    placeholder="LBS Centre / NTA / KPSC / TCS iON"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="Teacher & Professor Exams">Teacher & Professor Exams</option>
                    <option value="Kerala PSC & State Exams">Kerala PSC & State Exams</option>
                    <option value="IT & Corporate Hiring Exams">IT & Corporate Hiring Exams</option>
                    <option value="MCA & Entrance Exams">MCA & Entrance Exams</option>
                    <option value="Central & SSC Exams">Central & SSC Exams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Notification</label>
                  <input
                    type="date"
                    value={formData.notificationDate}
                    onChange={(e) => setFormData({ ...formData, notificationDate: e.target.value })}
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Deadline *</label>
                  <input
                    type="date"
                    value={formData.applicationEndDate}
                    onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Exam Date</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono capitalize">Official Link *</label>
                <input
                  type="url"
                  value={formData.officialUrl}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  placeholder="https://ktet.kerala.gov.in"
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono capitalize">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Eligibility notes & exam center details..."
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs capitalize"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-white text-black font-bold text-xs flex items-center space-x-1.5 hover:bg-zinc-200 transition-all capitalize"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Exam</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
