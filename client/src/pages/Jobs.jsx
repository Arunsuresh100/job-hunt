import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchJobs, toggleSaveItem, syncJobs } from '../api/client';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';

const Jobs = ({ onUpdateSavedCount }) => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1, total: 0 });
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyType, setCompanyType] = useState('ALL');
  const [indiaOnly, setIndiaOnly] = useState(true);
  const [fresherOnly, setFresherOnly] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs({
        page,
        limit: 20,
        search,
        company: selectedCompany,
        companyType,
        indiaOnly: indiaOnly ? 'true' : 'false',
        fresherOnly: fresherOnly ? 'true' : 'false',
        showArchived: showArchived ? 'true' : 'false'
      });

      if (data.success) {
        setJobs(data.jobs);
        setPagination(data.pagination);
        if (data.filters?.availableCompanies) {
          setAvailableCompanies(data.filters.availableCompanies);
        }
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, search, selectedCompany, companyType, indiaOnly, fresherOnly, showArchived]);

  const handleReset = () => {
    setSearch('');
    setSelectedCompany('');
    setCompanyType('ALL');
    setIndiaOnly(false);
    setFresherOnly(true);
    setShowArchived(false);
    setPage(1);
  };

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      loadJobs();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      await syncJobs();
      await loadJobs();
    } catch (err) {
      console.error('Error syncing jobs:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with User 3D Isometric Illustration */}
      <div className="mono-panel p-5 sm:p-7 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4 overflow-hidden relative min-h-[140px] sm:min-h-[170px]">
        <div className="flex-1 min-w-0 pr-2 z-10">
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Latest Entry-Level Jobs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-[210px] sm:max-w-md">
            Curated MCA & fresher job drives<br className="sm:hidden" /> updated in real-time.
          </p>
        </div>

        {/* User High-Resolution Large 3D Isometric Job Hunt Illustration on Right Side */}
        <div className="flex-shrink-0 flex items-center justify-end z-10">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/25 to-indigo-500/25 rounded-3xl blur-md group-hover:blur-lg transition-all" />
            <img
              src="/jobs_illustration.png"
              alt="3D Job Hunt Illustration"
              className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300 -my-4 sm:-my-6"
            />
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <FilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        selectedCompany={selectedCompany}
        setSelectedCompany={(val) => { setSelectedCompany(val); setPage(1); }}
        companiesList={availableCompanies}
        companyType={companyType}
        setCompanyType={(val) => { setCompanyType(val); setPage(1); }}
        indiaOnly={indiaOnly}
        setIndiaOnly={(val) => { setIndiaOnly(val); setPage(1); }}
        fresherOnly={fresherOnly}
        setFresherOnly={(val) => { setFresherOnly(val); setPage(1); }}
        showArchived={showArchived}
        setShowArchived={(val) => { setShowArchived(val); setPage(1); }}
        onReset={handleReset}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
        <div>
          Showing <strong className="text-white">{jobs.length}</strong> of <strong className="text-white">{pagination.total}</strong> postings
        </div>
        <div>
          Page {pagination.page} / {pagination.totalPages || 1}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="flex space-x-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex-1 w-full min-h-[350px] mono-panel p-10 text-center rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-3">
          <h3 className="text-base font-bold text-white">No new postings in the last 7 days</h3>

          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No active jobs match your search within the 7-day freshness window. 
            Enable <strong>"Show Archived"</strong> to view older listings.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setShowArchived(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold text-xs"
            >
              Show Archived
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 font-semibold text-xs border border-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4 font-mono">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 text-xs text-zinc-400">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default Jobs;
