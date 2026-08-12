import React, { useState, useEffect, useMemo } from 'react';
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
  BookmarkCheck
} from 'lucide-react';
import { fetchSavedItems, toggleSaveItem } from '../api/client';
import JobCard from '../components/JobCard';
import ExamCard from '../components/ExamCard';

const capitalizeText = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Saved = ({ onUpdateSavedCount }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedExams, setSavedExams] = useState([]);
  const [activeTab, setActiveTab] = useState('JOBS');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('LATEST');
  const [loading, setLoading] = useState(true);

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

  // Filter & Sort Jobs
  const filteredJobs = useMemo(() => {
    let result = [...savedJobs];
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
    if (sortBy === 'TITLE') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [savedJobs, searchQuery, sortBy]);

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
    if (sortBy === 'TITLE') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [savedExams, searchQuery, sortBy]);

  const totalSavedCount = savedJobs.length + savedExams.length;

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col space-y-5 pb-24 md:pb-8 max-w-5xl mx-auto w-full px-1 sm:px-4 animate-in fade-in duration-200">
      {/* Mobile-First App Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 sm:p-6 border border-zinc-800/90 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-purple-400 fill-purple-400/20" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-1 capitalize">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Bookmarked Opportunities</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight capitalize">
                Saved Jobs & Exams
              </h1>
              <p className="text-xs text-zinc-400 font-normal mt-0.5 capitalize">
                Access All Your Saved Postings And Application Deadlines In One Place
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
              <span className="text-sm font-extrabold text-indigo-400 font-mono">{savedJobs.length}</span>
            </div>
            <div className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center space-x-1.5 min-w-[76px]">
              <span className="text-[11px] font-semibold text-zinc-400 capitalize tracking-tight">Exams</span>
              <span className="text-sm font-extrabold text-pink-400 font-mono">{savedExams.length}</span>
            </div>
          </div>
        </div>
      </div>


      {/* App Segmented Tab Control */}
      <div className="bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800/90 flex items-center shadow-lg gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('JOBS')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
            activeTab === 'JOBS'
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Saved Jobs</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
              activeTab === 'JOBS'
                ? 'bg-white/20 text-white'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {savedJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EXAMS')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 capitalize ${
            activeTab === 'EXAMS'
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Saved Exams</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
              activeTab === 'EXAMS'
                ? 'bg-white/20 text-white'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {savedExams.length}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      {totalSavedCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/70">
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
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

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center space-x-1 capitalize">
              <Filter className="w-3 h-3 text-zinc-500" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors capitalize"
            >
              <option value="LATEST">Recently Saved</option>
              <option value="TITLE">Title (A - Z)</option>
            </select>
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
          <div className="flex-1 w-full min-h-[460px] sm:min-h-[540px] py-12 px-4 text-center bg-gradient-to-b from-zinc-900/40 to-zinc-950/80 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner relative group">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-md" />
              <Briefcase className="w-8 h-8 text-indigo-400 relative z-10" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight capitalize">
                {searchQuery ? 'No Matching Saved Jobs Found' : 'No Saved Jobs Yet'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed capitalize">
                {searchQuery
                  ? `No Bookmarked Jobs Match Your Search Query "${searchQuery}". Try Clearing Your Filter.`
                  : 'Bookmark Interesting Job Postings While Browsing To Access Them Quickly Anytime.'}
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
                to="/jobs"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 capitalize"
              >
                <span>Browse Latest Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
                variant="saved"
              />
            ))}
          </div>
        )
      ) : filteredExams.length === 0 ? (
        <div className="flex-1 w-full min-h-[460px] sm:min-h-[540px] py-12 px-4 text-center bg-gradient-to-b from-zinc-900/40 to-zinc-950/80 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner relative group">
            <div className="absolute inset-0 bg-pink-500/10 rounded-3xl blur-md" />
            <GraduationCap className="w-8 h-8 text-pink-400 relative z-10" />
          </div>

          <div className="max-w-md space-y-1.5">
            <h3 className="text-lg font-bold text-white tracking-tight capitalize">
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
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all active:scale-95 capitalize"
            >
              <span>Explore Exam Updates</span>
              <ArrowRight className="w-3.5 h-3.5" />
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

