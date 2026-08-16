import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building2, Briefcase, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-react';
import { fetchJobs, toggleSaveItem, syncJobs } from '../api/client';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';

const KERALA_DISTRICTS = [
  'ALL',
  'Ernakulam (Kochi)',
  'Thiruvananthapuram',
  'Kozhikode',
  'Thrissur',
  'Kottayam',
  'Palakkad',
  'Malappuram',
  'Kannur',
  'Kollam',
  'Alappuzha',
  'Wayanad',
  'Idukki',
  'Pathanamthitta',
  'Kasaragod'
];

const KeralaJobs = ({ onUpdateSavedCount, userProfile = null }) => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1, total: 0 });
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [districtCounts, setDistrictCounts] = useState({});
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef(null);

  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyType, setCompanyType] = useState('ALL');
  const [fresherOnly, setFresherOnly] = useState(true);
  const [expLevel, setExpLevel] = useState('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  // Close district dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(e.target)) {
        setDistrictDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all Kerala jobs to compute live job counts per district
  useEffect(() => {
    fetchJobs({ page: 1, limit: 100, keralaOnly: 'true' }).then(res => {
      if (res.success && res.jobs) {
        const counts = { ALL: res.jobs.length };
        res.jobs.forEach(j => {
          const loc = (j.location || '').toLowerCase();
          KERALA_DISTRICTS.forEach(dist => {
            if (dist === 'ALL') return;
            const searchName = dist.split(' ')[0].toLowerCase();
            if (
              loc.includes(searchName) ||
              (searchName === 'ernakulam' && loc.includes('kochi')) ||
              (searchName === 'thiruvananthapuram' && loc.includes('trivandrum')) ||
              (searchName === 'kozhikode' && loc.includes('calicut'))
            ) {
              counts[dist] = (counts[dist] || 0) + 1;
            }
          });
        });
        setDistrictCounts(counts);
      }
    }).catch(err => console.error('Error fetching district counts:', err));
  }, []);

  const loadKeralaJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs({
        page,
        limit: 20,
        search,
        keralaOnly: 'true',
        district: selectedDistrict !== 'ALL' ? selectedDistrict : '',
        company: selectedCompany,
        companyType,
        fresherOnly: fresherOnly ? 'true' : 'false',
        expLevel,
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
      console.error('Error loading Kerala jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeralaJobs();
  }, [page, search, selectedDistrict, selectedCompany, companyType, fresherOnly, expLevel, showArchived]);

  const handleReset = () => {
    setSearch('');
    setSelectedDistrict('ALL');
    setSelectedCompany('');
    setCompanyType('ALL');
    setFresherOnly(true);
    setExpLevel('ALL');
    setShowArchived(false);
    setPage(1);
  };

  const handleToggleSave = async (itemType, itemId) => {
    try {
      await toggleSaveItem(itemType, itemId);
      loadKeralaJobs();
      if (onUpdateSavedCount) onUpdateSavedCount();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Kerala Special Hero Banner */}
      <div className="mono-panel p-5 sm:p-7 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 relative overflow-hidden shadow-xl space-y-4">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row: Text on Left, Malayali Man Graphic on Right */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0 z-10 pr-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[8px] text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 whitespace-nowrap flex-shrink-0">
              <span>🌴</span>
              <span className="whitespace-nowrap">Kerala IT Parks & Tech Drives</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
              Fresher Tech Jobs in Kerala
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-full sm:max-w-xl leading-relaxed font-medium">
              Curated fresher IT drives across <strong>Infopark Kochi</strong>, <strong>Technopark Trivandrum</strong> & <strong>Cyberpark Kozhikode</strong>.
            </p>
          </div>

          {/* New Custom Malayali Man Graphic on Right Side */}
          <div className="flex-shrink-0 flex items-center justify-end z-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-3xl blur-md group-hover:blur-lg transition-all" />
              <img
                src="/kerala_illustration.png"
                alt="Kerala Job Hunt Illustration"
                className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300 -my-2"
              />
            </div>
          </div>
        </div>

        {/* IT Park Highlights (Scrollbar hidden via no-scrollbar) */}
        <div className="pt-3 mt-2 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] font-mono text-zinc-300 z-10">
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="whitespace-nowrap font-semibold text-white">Infopark Kochi</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="whitespace-nowrap font-semibold text-white">Technopark Trivandrum</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="whitespace-nowrap font-semibold text-white">Cyberpark Kozhikode</span>
          </span>
        </div>
      </div>

      {/* Custom Kerala District Dropdown Filter */}
      <div className={`mono-panel p-4 rounded-xl border border-zinc-800 space-y-3 relative transition-all ${districtDropdownOpen ? 'z-40' : 'z-20'}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Filter by Kerala District:</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {pagination.total || jobs.length} Kerala Postings
          </span>
        </div>

        {/* Custom District Dropdown */}
        <div className="relative" ref={districtDropdownRef}>
          <button
            type="button"
            onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white flex items-center justify-between transition-colors focus:outline-none shadow-sm"
          >
            <div className="flex items-center space-x-2 truncate">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-zinc-200 truncate">
                {selectedDistrict === 'ALL' ? 'All Kerala Districts' : selectedDistrict}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                {districtCounts[selectedDistrict] || pagination.total || 0} Jobs
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${districtDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </div>
          </button>

          {/* Dropdown Options List */}
          {districtDropdownOpen && (
            <div className="absolute z-[100] left-0 right-0 top-full mt-1.5 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-1 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
              {KERALA_DISTRICTS.map((dist) => {
                const count = districtCounts[dist] || (dist === 'ALL' ? pagination.total || 0 : 0);
                const isSelected = selectedDistrict === dist;
                return (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(dist);
                      setDistrictDropdownOpen(false);
                      setPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-300 font-bold'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      <span className="truncate">{dist === 'ALL' ? 'All Kerala Districts' : dist}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex-shrink-0 ml-2 ${
                      count > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}>
                      {count} {count === 1 ? 'job' : 'jobs'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Common Filter Bar (Search, Company, Product/Service) */}
      <FilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        selectedCompany={selectedCompany}
        setSelectedCompany={(val) => { setSelectedCompany(val); setPage(1); }}
        companiesList={availableCompanies}
        companyType={companyType}
        setCompanyType={(val) => { setCompanyType(val); setPage(1); }}
        fresherOnly={fresherOnly}
        setFresherOnly={(val) => { setFresherOnly(val); setPage(1); }}
        expLevel={expLevel}
        setExpLevel={(val) => { setExpLevel(val); setPage(1); }}
        onReset={handleReset}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-400 font-mono">
        <div>
          Showing <strong className="text-white">{jobs.length}</strong> Kerala postings
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
        <div className="flex-1 w-full min-h-[300px] mono-panel p-10 text-center rounded-xl border border-zinc-800 flex flex-col items-center justify-center space-y-3">
          <h3 className="text-base font-bold text-white">No jobs found in selected district</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try switching to <strong>"All Districts"</strong> or reset your search filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs shadow-sm hover:bg-emerald-400 transition-colors"
          >
            Reset District Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} onToggleSave={handleToggleSave} userProfile={userProfile} />
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

export default KeralaJobs;
