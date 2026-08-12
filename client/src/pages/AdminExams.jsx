import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { fetchExams, createExam, updateExam, deleteExam } from '../api/client';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const defaultFormData = {
    name: '',
    conductingBody: '',
    category: 'Teaching & Lectureship',
    notificationDate: new Date().toISOString().split('T')[0],
    applicationStartDate: new Date().toISOString().split('T')[0],
    applicationEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    examDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    officialUrl: '',
    description: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errorMsg, setErrorMsg] = useState('');

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await fetchExams();
      if (res.success) {
        setExams(res.exams);
      }
    } catch (err) {
      console.error('Error loading exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingId(exam.id);
    setFormData({
      name: exam.name || '',
      conductingBody: exam.conductingBody || '',
      category: exam.category || 'Teaching & Lectureship',
      notificationDate: exam.notificationDate ? new Date(exam.notificationDate).toISOString().split('T')[0] : '',
      applicationStartDate: exam.applicationStartDate ? new Date(exam.applicationStartDate).toISOString().split('T')[0] : '',
      applicationEndDate: exam.applicationEndDate ? new Date(exam.applicationEndDate).toISOString().split('T')[0] : '',
      examDate: exam.examDate ? new Date(exam.examDate).toISOString().split('T')[0] : '',
      officialUrl: exam.officialUrl || '',
      description: exam.description || ''
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exam entry?')) {
      try {
        await deleteExam(id);
        loadExams();
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.conductingBody || !formData.applicationEndDate || !formData.officialUrl) {
      setErrorMsg('Mandatory fields missing.');
      return;
    }

    try {
      if (editingId) {
        await updateExam(editingId, formData);
      } else {
        await createExam(formData);
      }
      setShowModal(false);
      loadExams();
    } catch (err) {
      setErrorMsg('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="mono-panel p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider">
            Admin Panel
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Manage Exam Entries
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Entry</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs mono-panel rounded-xl">
          Loading entries...
        </div>
      ) : (
        <div className="mono-panel rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Exam & Body</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">App Deadline</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-200">
                {exams.map(exam => (
                  <tr key={exam.id} className="hover:bg-zinc-900/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{exam.name}</div>
                      <div className="text-[11px] text-zinc-400">{exam.conductingBody}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{exam.category}</td>
                    <td className="px-4 py-3 font-mono">
                      {new Date(exam.applicationEndDate).toLocaleDateString()}
                      {exam.isUrgent && (
                        <span className="ml-2 px-1.5 py-0.2 rounded bg-white text-black font-bold text-[10px]">
                          {exam.daysRemaining}d left
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(exam)} className="p-1 text-zinc-400 hover:text-white">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(exam.id)} className="p-1 text-zinc-400 hover:text-white">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="mono-panel w-full max-w-lg p-6 rounded-xl border border-zinc-700 bg-zinc-950 space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Exam' : 'Add Exam Entry'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Exam Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Conducting Body *</label>
                  <input
                    type="text"
                    value={formData.conductingBody}
                    onChange={e => setFormData({ ...formData, conductingBody: e.target.value })}
                    className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-zinc-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Teaching & Lectureship">Teaching & Lectureship</option>
                    <option value="Engineering & Higher Studies">Engineering & Higher Studies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Notification</label>
                  <input
                    type="date"
                    value={formData.notificationDate}
                    onChange={e => setFormData({ ...formData, notificationDate: e.target.value })}
                    className="w-full px-2 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">App Deadline *</label>
                  <input
                    type="date"
                    value={formData.applicationEndDate}
                    onChange={e => setFormData({ ...formData, applicationEndDate: e.target.value })}
                    className="w-full px-2 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Exam Date</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-2 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Official Link *</label>
                <input
                  type="url"
                  value={formData.officialUrl}
                  onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded text-white focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-white text-black font-bold flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminExams;
