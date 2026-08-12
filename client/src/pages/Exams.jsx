import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Save, AlertCircle, GraduationCap } from 'lucide-react';
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
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const defaultForm = {
    name: '',
    conductingBody: '',
    category: 'Teaching & Lectureship',
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
      category: exam.category || 'Teaching & Lectureship',
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
        await updateExam(editingExam.id, formData);
      } else {
        await createExam(formData);
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
    { label: 'Teaching & Lectureship', value: 'Teaching & Lectureship' },
    { label: 'Engineering & Higher Studies', value: 'Engineering & Higher Studies' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Clean & Simple Header Banner */}
      <div className="mono-panel p-5 sm:p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight capitalize">
            Exam Updates & Notifications
          </h1>
          <p className="text-xs text-zinc-400 mt-1 capitalize">
            Track Official Exam Schedules, Application Deadlines, And Portal Verification
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {urgentCount > 0 && (
            <span className="px-2.5 py-1 rounded bg-white text-black font-mono font-bold text-xs capitalize">
              {urgentCount} Closing Soon
            </span>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all active:scale-95 capitalize shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        </div>
      </div>

      {/* Streamlined Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Exams (UGC NET, K-SET, GATE, CTET...)"
            className="w-full pl-9 pr-8 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                category === cat.value
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800/80 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
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
        <div className="flex-1 w-full min-h-[350px] mono-panel p-10 text-center rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-2">
          <GraduationCap className="w-8 h-8 text-zinc-600 mx-auto mb-2" />

          <h3 className="text-sm font-bold text-white capitalize">No Exam Notifications Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto capitalize">
            {search || category
              ? 'Try Adjusting Your Search Or Filter Category.'
              : 'Click "+ Add Exam" Above To Insert A New Notification.'}
          </p>
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
          <div className="mono-panel w-full max-w-lg p-5 rounded-xl border border-zinc-700 bg-zinc-950 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white capitalize">
                {editingExam ? 'Edit Exam Notification' : 'Add Exam Notification'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2 rounded.xl bg-zinc-900 border border-zinc-800 text-white text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
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
                  placeholder="e.g. UGC NET Computer Science 2026"
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
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
                    placeholder="NTA / CBSE / IIT Roorkee"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 capitalize"
                  >
                    <option value="Teaching & Lectureship">Teaching & Lectureship</option>
                    <option value="Engineering & Higher Studies">Engineering & Higher Studies</option>
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
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Deadline *</label>
                  <input
                    type="date"
                    value={formData.applicationEndDate}
                    onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono capitalize">Exam Date</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-2 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono capitalize">Official Link *</label>
                <input
                  type="url"
                  value={formData.officialUrl}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  placeholder="https://ugcnet.nta.ac.in"
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono capitalize">Description / Notes</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Eligibility notes..."
                  className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
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

