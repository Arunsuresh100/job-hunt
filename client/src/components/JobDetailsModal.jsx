import React from 'react';
import {
  X,
  Building,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Share2,
  Globe,
  Award,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const capitalizeCompanyText = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((w) => {
      const clean = w.toUpperCase().replace(/[()]/g, '');
      if (['TCS', 'UST', 'IBM', 'CTS', 'IBS', 'AI', 'IT', 'QA', 'NQT', 'CEE', 'SET', 'KTET', 'SSC', 'CGL', 'CHSL', 'UGC', 'NET', 'JRF', 'PSC'].includes(clean)) {
        return w;
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Just Now';
  const now = Date.now();
  const posted = new Date(dateStr).getTime();
  if (isNaN(posted) || posted > now) return 'Just Now';

  const diffMins = Math.floor((now - posted) / (1000 * 60));
  if (diffMins < 5) return 'Just Now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const JobDetailsModal = ({ job, isOpen, onClose, onToggleSave, userProfile }) => {
  if (!isOpen || !job) return null;

  const {
    id,
    company,
    logoUrl,
    title,
    location,
    experienceLevel,
    companyType,
    postedDate,
    applyUrl,
    source,
    description,
    isSaved,
  } = job;

  // Extract clean domain for trust indicator
  let cleanDomain = 'Official Portal';
  try {
    if (applyUrl) {
      const urlObj = new URL(applyUrl);
      cleanDomain = urlObj.hostname.replace(/^www\./, '');
    }
  } catch (e) {
    cleanDomain = 'Official Portal';
  }

  const relativeTimeLabel = formatRelativeTime(postedDate);

  // Dynamic Button Label matching Source
  let actionButtonText = `Apply via ${source || cleanDomain}`;
  if (source && source.toLowerCase().includes('linkedin')) {
    actionButtonText = 'Apply via LinkedIn';
  } else if (source && source.toLowerCase().includes('naukri')) {
    actionButtonText = 'Apply via Naukri.com';
  } else if (source && source.toLowerCase().includes('foundit')) {
    actionButtonText = 'Apply via FoundIt';
  } else if (source && source.toLowerCase().includes('indeed')) {
    actionButtonText = 'Apply via Indeed';
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
        
        {/* Top Header Banner (With generous right padding to prevent button overlap) */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-950 via-emerald-950/40 to-zinc-950 border-b border-zinc-800/80 relative pr-14 sm:pr-16">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95 z-20"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <CompanyLogo logoUrl={logoUrl} company={company} applyUrl={applyUrl} className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wide truncate">
                  {capitalizeCompanyText(company)}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center space-x-1 flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{source || 'Verified Source'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Full Width Left-Aligned Job Title */}
          <div className="mt-3.5 w-full">
            <h2 className="text-base sm:text-2xl font-black text-white leading-snug tracking-tight text-left">
              {title}
            </h2>
          </div>

          {/* Quick Info Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-xs">
            <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{location}</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{experienceLevel || 'Fresher Eligible'}</span>
            </span>

            {companyType && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>{companyType} Based</span>
              </span>
            )}

            <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{relativeTimeLabel}</span>
            </span>
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm text-zinc-300">
          
          {/* Trust Verification Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <h4 className="font-bold text-white">Verified {source || 'Portal'} Link</h4>
              <p className="text-zinc-400 leading-relaxed">
                This link routes directly to <strong>{cleanDomain}</strong> for fast submission.
              </p>
            </div>
          </div>

          {/* Job Overview Grid (Capitalized Title Case Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Hiring Company</span>
              <span className="font-semibold text-white truncate block">{capitalizeCompanyText(company)}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Work Location</span>
              <span className="font-semibold text-white truncate block">{capitalizeCompanyText(location)}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Experience Level</span>
              <span className="font-semibold text-white truncate block">{capitalizeCompanyText(experienceLevel || 'Fresher (0-2 Yrs)')}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Country</span>
              <span className="font-semibold text-emerald-400 truncate block">India</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Posting Source</span>
              <span className="font-semibold text-white truncate block">{capitalizeCompanyText(source || 'Official Site')}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 block tracking-tight">Posted Date</span>
              <span className="font-semibold text-white truncate block">{capitalizeCompanyText(relativeTimeLabel)}</span>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Job Role Description & Key Responsibilities</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 leading-relaxed text-zinc-300 font-normal space-y-2">
              {description ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>{company}</strong> is currently inviting applications for the <strong>{title}</strong> position based out of <strong>{location}</strong>.
                  </p>
                  <p>
                    This entry-level / fresher drive is tailored for software engineers proficient in modern web development, software engineering fundamentals, problem solving, and analytical thinking.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Design, code, test, and debug high-quality software solutions.</li>
                    <li>Collaborate with cross-functional development teams and senior architects.</li>
                    <li>Participate in code reviews, continuous delivery pipelines, and agile software development cycles.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-3.5 sm:p-5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave('JOB', id)}
            className={`p-3 rounded-xl border transition-all active:scale-95 flex items-center justify-center space-x-2 flex-shrink-0 ${
              isSaved
                ? 'bg-white text-black border-white shadow-md font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-black' : ''}`} />
            <span className="text-xs font-semibold hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 min-w-0"
          >
            <span className="whitespace-nowrap truncate">{actionButtonText} ({cleanDomain})</span>
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
