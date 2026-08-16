import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  Briefcase,
  Sparkles,
  Filter,
  ChevronDown,
  Check,
  Building,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { fetchJobs, toggleSaveItem } from '../api/client';
import JobCard from '../components/JobCard';

const PortalJobs = ({ userProfile, onUpdateSavedCount }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [portalSource, setPortalSource] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);

  const portalRef = useRef(null);

  // Close portal dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (portalRef.current && !portalRef.current.contains(e.target)) {
        setIsPortalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPortalJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs({
        search,
        companyType,
        source: portalSource,
        sourceType: 'PORTAL',
        limit: 50,
      });

      if (data.success) {
        let fetched = data.jobs || [];
        // If specific portal filter selected, filter client-side as well for accuracy
        if (portalSource) {
          fetched = fetched.filter(
            (j) => j.sourceName && j.sourceName.toLowerCase().includes(portalSource.toLowerCase())
          );
        } else {
          // Show all aggregator portal jobs (LinkedIn, Naukri, FoundIt, Indeed, Jobicy, Remotive, Adzuna, JSearch)
          fetched = fetched.filter(
            (j) =>
              j.sourceName &&
              (j.sourceName.toLowerCase().includes('linkedin') ||
                j.sourceName.toLowerCase().includes('naukri') ||
                j.sourceName.toLowerCase().includes('foundit') ||
                j.sourceName.toLowerCase().includes('indeed') ||
                j.sourceName.toLowerCase().includes('monster') ||
                j.sourceName.toLowerCase().includes('jobicy') ||
                j.sourceName.toLowerCase().includes('remotive') ||
                j.sourceName.toLowerCase().includes('adzuna') ||
                j.sourceName.toLowerCase().includes('jsearch'))
          );
        }
        setJobs(fetched);
      }
    } catch (err) {
      console.error('Error loading portal jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalJobs();
  }, [search, portalSource, companyType]);

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      loadPortalJobs();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const portalOptions = [
    { label: 'All Portals (LinkedIn, Naukri, Indeed)', value: '' },
    { label: 'LinkedIn Jobs', value: 'LinkedIn' },
    { label: 'Naukri.com', value: 'Naukri' },
    { label: 'FoundIt / Monster', value: 'FoundIt' },
    { label: 'Indeed & Glassdoor', value: 'Indeed' },
  ];

  const activePortalLabel = portalOptions.find((p) => p.value === portalSource)?.label || 'All Portals';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Hero Section Banner */}
      <div className="mono-panel p-5 sm:p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 relative overflow-hidden shadow-xl space-y-4">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[8px] text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
            <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="whitespace-nowrap">LinkedIn, Naukri & Major Job Portals</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
            LinkedIn, Naukri & Corporate Job Portals
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            Verified hiring drives and direct recruiters sourced from <strong>LinkedIn Careers</strong>, <strong>Naukri.com</strong>, <strong>FoundIt</strong>, and <strong>Indeed</strong> for entry-level IT roles (0-2 Yrs).
          </p>
        </div>

        {/* Quick Portal Filter Brand Tags */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-semibold z-10">
          <button
            type="button"
            onClick={() => setPortalSource('LinkedIn')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 whitespace-nowrap flex-shrink-0 transition-all ${
              portalSource === 'LinkedIn'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 font-bold shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>LinkedIn Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalSource('Naukri')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 whitespace-nowrap flex-shrink-0 transition-all ${
              portalSource === 'Naukri'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 font-bold shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Naukri.com</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalSource('FoundIt')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 whitespace-nowrap flex-shrink-0 transition-all ${
              portalSource === 'FoundIt'
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 font-bold shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>FoundIt / Monster</span>
          </button>

          <button
            type="button"
            onClick={() => setPortalSource('Indeed')}
            className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 whitespace-nowrap flex-shrink-0 transition-all ${
              portalSource === 'Indeed'
                ? 'bg-teal-600/20 text-teal-300 border-teal-500/50 font-bold shadow-md'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Indeed & Glassdoor</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Search Bar + Custom Glassmorphic Portal Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/90 shadow-xl z-40 relative">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search LinkedIn & Naukri Jobs (React, Java...)"
            className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Custom Portal Filter Dropdown */}
        <div className="relative w-full sm:w-auto flex justify-end" ref={portalRef}>
          <button
            type="button"
            onClick={() => setIsPortalDropdownOpen(!isPortalDropdownOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start space-x-2.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-zinc-400 font-normal">Portal:</span>
              <span className="font-bold text-white truncate max-w-[140px] sm:max-w-none">{activePortalLabel}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ml-1 ${
                isPortalDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Floating Options Menu */}
          {isPortalDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-full sm:w-72 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
              {portalOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPortalSource(opt.value);
                    setIsPortalDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    portalSource === opt.value
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {portalSource === opt.value && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Postings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-5 bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="h-10 bg-zinc-800/40 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex-1 w-full min-h-[300px] mono-panel p-8 text-center rounded-2xl border border-zinc-800 flex flex-col items-center justify-center space-y-3 shadow-xl">
          <Globe className="w-10 h-10 text-emerald-400 mx-auto" />

          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-white capitalize">No Portal Postings Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto capitalize">
              {search || portalSource
                ? 'Try Adjusting Your Portal Filter Or Search Keywords.'
                : 'Click "Sync Live Feeds" Above To Fetch New LinkedIn & Naukri Postings.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onToggleSave={handleToggleSave}
              userProfile={userProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalJobs;
