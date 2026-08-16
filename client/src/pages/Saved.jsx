import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  GraduationCap,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Check,
  Clock,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { fetchSavedItems, toggleSaveItem } from '../api/client';
import JobCard from '../components/JobCard';
import ExamCard from '../components/ExamCard';

const SORT_OPTIONS = [
  { id: 'LATEST', label: 'Sort by Date (Latest)' },
  { id: 'OLDEST', label: 'Sort by Date (Oldest)' },
  { id: 'TITLE', label: 'Title (A - Z)' },
];

const Saved = ({ onUpdateSavedCount, userProfile = null }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedExams, setSavedExams] = useState([]);
  const [activeTab, setActiveTab] = useState('JOBS');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('LATEST'); // Default: Sort by Date (Latest)
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPLIED'
  const [loading, setLoading] = useState(true);

  const sortRef = useRef(null);

  // Close custom sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Local storage persistence for Applied Jobs
  const [appliedJobIds, setAppliedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jobhunt_applied_jobs') || '[]');
    } catch (e) {
      return [];
    }
  });

  const toggleAppliedJob = (jobId) => {
    setAppliedJobIds((prev) => {
      let updated;
      if (prev.includes(jobId)) {
        updated = prev.filter((id) => id !== jobId);
      } else {
        updated = [...prev, jobId];
      }
      localStorage.setItem('jobhunt_applied_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await fetchSavedItems();
      if (data.success) {
        setSavedJobs(data.savedJobs || []);
        setSavedExams(data.savedExams || []);
      }
    } catch (err) {
      console.error('Error loading saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      await loadSaved();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Applied & Pending Job Counts
  const appliedCount = useMemo(() => {
    return savedJobs.filter((j) => appliedJobIds.includes(j.id)).length;
  }, [savedJobs, appliedJobIds]);

  const pendingCount = useMemo(() => {
    return savedJobs.length - appliedCount;
  }, [savedJobs, appliedCount]);

  // Filter & Sort Jobs
  const filteredJobs = useMemo(() => {
    let result = [...savedJobs];

    if (statusFilter === 'PENDING') {
      result = result.filter((job) => !appliedJobIds.includes(job.id));
    } else if (statusFilter === 'APPLIED') {
      result = result.filter((job) => appliedJobIds.includes(job.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.source?.toLowerCase().includes(q)
      );
    }

    // Sort by Date (Latest), Oldest, or Title
    if (sortBy === 'LATEST') {
      result.sort((a, b) => new Date(b.postedDate || b.createdAt || 0) - new Date(a.postedDate || a.createdAt || 0));
    } else if (sortBy === 'OLDEST') {
      result.sort((a, b) => new Date(a.postedDate || a.createdAt || 0) - new Date(b.postedDate || b.createdAt || 0));
    } else if (sortBy === 'TITLE') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [savedJobs, searchQuery, sortBy, statusFilter, appliedJobIds]);

  // Filter & Sort Exams
  const filteredExams = useMemo(() => {
    let result = [...savedExams];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (exam) =>
          exam.name?.toLowerCase().includes(q) ||
          exam.conductingBody?.toLowerCase().includes(q) ||
          exam.category?.toLowerCase().includes(q) ||
          exam.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'LATEST') {
      result.sort((a, b) => new Date(b.startDate || b.createdAt || 0) - new Date(a.startDate || a.createdAt || 0));
    } else if (sortBy === 'OLDEST') {
      result.sort((a, b) => new Date(a.startDate || a.createdAt || 0) - new Date(b.startDate || b.createdAt || 0));
    } else if (sortBy === 'TITLE') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [savedExams, searchQuery, sortBy]);

  const totalSavedCount = savedJobs.length + savedExams.length;
  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === sortBy)?.label || 'Sort by Date (Latest)';

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col space-y-5 pb-24 md:pb-8 max-w-5xl mx-auto w-full px-1 sm:px-4 animate-in fade-in duration-200">
      
      {/* Mobile-First App Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 p-4 sm:p-6 border border-emerald-500/30 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-1 capitalize">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Bookmarked Opportunities</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight capitalize bg-gradient-to-r from-white via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
                Saved Jobs & Exams
              </h1>
              <p className="text-xs text-zinc-400 font-normal mt-0.5 capitalize">
                Track your saved jobs, application status & exam deadlines
              </p>
            </div>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
            <div className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center space-x-1.5 min-w-[76px]">
              <span className="text-[11px] font-semibold text-zinc-400 capitalize tracking-tight">Total</span>
              <span className="text-sm font-extrabold text-white font-mono">{totalSavedCount}</span>
            </div>
            <div className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center space-x-1.5 min-w-[76px]">
              <span className="text-[11px] font-semibold text-zinc-400 capitalize tracking-tight">Jobs</span>
              <span className="text-sm font-extrabold text-white font-mono">{savedJobs.length}</span>
            </div>
            <div className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center space-x-1.5 min-w-[76px]">
              <span className="text-[11px] font-semibold text-zinc-400 capitalize tracking-tight">Exams</span>
              <span className="text-sm font-extrabold text-white font-mono">{savedExams.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* App Segmented Tab Control (Crisp White Active Tab Theme) */}
      <div className="bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800/90 flex items-center shadow-lg gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('JOBS')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
            activeTab === 'JOBS'
              ? 'bg-white text-black shadow-md shadow-white/10'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Briefcase className={`w-4 h-4 flex-shrink-0 ${activeTab === 'JOBS' ? 'text-black' : 'text-zinc-400'}`} />
          <span className="whitespace-nowrap">Saved Jobs</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors flex-shrink-0 ${
              activeTab === 'JOBS'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {savedJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EXAMS')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
            activeTab === 'EXAMS'
              ? 'bg-white text-black shadow-md shadow-white/10'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <GraduationCap className={`w-4 h-4 flex-shrink-0 ${activeTab === 'EXAMS' ? 'text-black' : 'text-zinc-400'}`} />
          <span className="whitespace-nowrap">Saved Exams</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors flex-shrink-0 ${
              activeTab === 'EXAMS'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {savedExams.length}
          </span>
        </button>
      </div>

      {/* Application Status Filter Pills Bar */}
      {activeTab === 'JOBS' && savedJobs.length > 0 && (
        <div className="flex items-center justify-between gap-2 p-2 bg-zinc-950/80 rounded-xl border border-zinc-800/80">
          <span className="text-xs font-bold text-zinc-400 pl-1 hidden sm:inline">Application Status:</span>
          
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center space-x-1 whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-white text-black border border-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <span className="whitespace-nowrap">All Jobs</span>
              <span className={`ml-1 text-[10px] font-mono font-bold whitespace-nowrap ${statusFilter === 'ALL' ? 'text-black' : 'text-zinc-400 opacity-80'}`}>({savedJobs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center space-x-1 whitespace-nowrap ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="whitespace-nowrap">Pending</span>
              <span className="ml-1 text-[10px] font-mono opacity-80 whitespace-nowrap">({pendingCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('APPLIED')}
              className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center space-x-1 whitespace-nowrap ${
                statusFilter === 'APPLIED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="whitespace-nowrap">Applied</span>
              <span className="ml-1 text-[10px] font-mono opacity-80 whitespace-nowrap">({appliedCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar with Custom Modern Dropdown */}
      {totalSavedCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/70 z-40">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'JOBS'
                  ? 'Search Saved Jobs...'
                  : 'Search Saved Exams...'
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Custom Glassmorphic Sort Dropdown */}
          <div className="relative w-full sm:w-auto flex justify-end" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
            >
              <div className="flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-zinc-400 font-normal">Sort:</span>
                <span className="font-bold text-white">{activeSortLabel}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-1 ${
                  isSortOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Floating Options Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      sortBy === opt.id
                        ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="flex space-x-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-zinc-800/40 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : activeTab === 'JOBS' ? (
        filteredJobs.length === 0 ? (
          /* Reduced Height Compact Empty State Card */
          <div className="w-full py-8 sm:py-10 px-4 text-center bg-gradient-to-b from-zinc-900/40 to-zinc-950/80 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-md" />
              <Briefcase className="w-6 h-6 text-emerald-400 relative z-10" />
            </div>

            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight capitalize">
                {statusFilter === 'APPLIED'
                  ? 'No Applied Jobs Yet'
                  : statusFilter === 'PENDING'
                  ? 'No Pending Jobs'
                  : searchQuery
                  ? 'No Matching Saved Jobs Found'
                  : 'No Saved Jobs Yet'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed capitalize">
                {statusFilter === 'APPLIED'
                  ? 'Click "Mark Applied" on any saved job card to track your submitted job applications.'
                  : statusFilter === 'PENDING'
                  ? 'You have marked all your saved jobs as applied!'
                  : searchQuery
                  ? `No Bookmarked Jobs Match Your Search Query "${searchQuery}". Try Clearing Your Filter.`
                  : 'Bookmark Interesting Job Postings While Browsing To Access Them Quickly Anytime.'}
              </p>
            </div>

            {searchQuery || statusFilter !== 'ALL' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all active:scale-95 capitalize"
              >
                <span>Reset Filters</span>
              </button>
            ) : (
              <Link
                to="/jobs"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 capitalize"
              >
                <span>Browse Latest Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{ ...job, isSaved: true }}
                onToggleSave={handleToggleSave}
                userProfile={userProfile}
                isApplied={appliedJobIds.includes(job.id)}
                onToggleApplied={toggleAppliedJob}
                variant="saved"
              />
            ))}
          </div>
        )
      ) : filteredExams.length === 0 ? (
        /* Reduced Height Compact Empty State Card for Exams */
        <div className="w-full py-8 sm:py-10 px-4 text-center bg-gradient-to-b from-zinc-900/40 to-zinc-950/80 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner relative group">
            <div className="absolute inset-0 bg-teal-500/10 rounded-2xl blur-md" />
            <GraduationCap className="w-6 h-6 text-teal-400 relative z-10" />
          </div>

          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight capitalize">
              {searchQuery ? 'No Matching Saved Exams Found' : 'No Saved Exams Yet'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed capitalize">
              {searchQuery
                ? `No Bookmarked Exams Match Your Search Query "${searchQuery}". Try Clearing Your Filter.`
                : 'Save Key Exam Notifications To Keep Track Of Upcoming Application Deadlines.'}
            </p>
          </div>

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all active:scale-95 capitalize"
            >
              <span>Clear Search Filter</span>
            </button>
          ) : (
            <Link
              to="/exams"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 capitalize"
            >
              <span>Explore Exam Updates</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={{ ...exam, isSaved: true }}
              onToggleSave={handleToggleSave}
              variant="saved"
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Saved;
