import React from 'react';
import { MapPin, Calendar, ExternalLink, Bookmark, Clock, Check, Box, Layers, Rocket, Sparkles } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

const capitalizeText = (str) => {
  if (!str) return '';
  if (str === str.toUpperCase()) {
    return str
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const JobCard = ({ job, onToggleSave, variant = 'default', userProfile = null }) => {
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
    isArchived,
    daysAgo,
    isSaved,
  } = job || {};

  const isFresh = daysAgo <= 7 && !isArchived;

  // Calculate Match Score % based on User Profile
  const userSkills = userProfile?.skills || [];
  let matchScore = 0;
  if (userSkills.length > 0) {
    const text = `${title} ${company} ${location}`.toLowerCase();
    const count = userSkills.filter(s => text.includes(s.toLowerCase())).length;
    matchScore = Math.min(98, 75 + count * 8);
  }

  // Saved page card variant option if needed
  if (variant === 'saved') {
    return (
      <div
        className={`bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/90 p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative group transition-all duration-200 shadow-md ${
          isFresh ? 'border-l-4 border-l-indigo-500' : 'border-l-4 border-l-zinc-700 opacity-90'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center space-x-3 min-w-0">
              <CompanyLogo logoUrl={logoUrl} company={company} applyUrl={applyUrl} className="w-10 h-10" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold tracking-wide text-zinc-300 truncate capitalize">
                    {capitalizeText(company)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 font-mono border border-zinc-800/80 capitalize flex-shrink-0">
                    {source ? capitalizeText(source) : 'Feed'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mt-0.5 capitalize">
                  {title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave('JOB', id)}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex-shrink-0 ${
                isSaved
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Row 1 Badges: Experience Level & Company Type */}
          <div className="flex flex-wrap items-center gap-2 mt-3 mb-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-950 text-zinc-300 border border-zinc-800/80 capitalize">
              <Check className="w-3 h-3 text-indigo-400" />
              <span>{experienceLevel}</span>
            </span>

            {companyType && (
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  companyType === 'Startup'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : companyType === 'Service'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {companyType === 'Startup' ? (
                  <Rocket className="w-3 h-3 text-emerald-400" />
                ) : companyType === 'Service' ? (
                  <Layers className="w-3 h-3 text-amber-400" />
                ) : (
                  <Box className="w-3 h-3 text-indigo-400" />
                )}
                <span>{companyType === 'Startup' ? 'Startup' : `${companyType} Based`}</span>
              </span>
            )}
          </div>

          {/* Row 2 Badges: Location (Truncated) & Days Ago */}
          <div className="flex items-center gap-2 mb-3 min-w-0">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-950 text-zinc-400 border border-zinc-800/80 capitalize min-w-0 flex-1">
              <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </span>

            {isFresh ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 capitalize flex-shrink-0">
                <Clock className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                <span className="whitespace-nowrap">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 bg-zinc-950 border border-zinc-800/80 capitalize flex-shrink-0">
                <Clock className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{daysAgo}d ago</span>
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-zinc-600" />
            <span>
              {new Date(postedDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </span>

          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-sm transition-all active:scale-95 capitalize"
          >
            <span>Apply Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Standard Job Card Design
  return (
    <div
      className={`mono-card p-5 rounded-xl flex flex-col justify-between relative group ${
        isFresh ? 'border-l-2 border-l-white' : 'border-l-2 border-l-zinc-700 opacity-80'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <CompanyLogo logoUrl={logoUrl} company={company} applyUrl={applyUrl} className="w-10 h-10" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold tracking-wide text-zinc-300 truncate">
                  {capitalizeText(company)}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-500 font-mono border border-zinc-800 flex-shrink-0">
                  {source || 'Feed'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors line-clamp-1 mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave('JOB', id)}
            className={`p-1.5 rounded-lg border transition-all flex-shrink-0 ${
              isSaved
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Row 1 Badges: Experience Level & Company Type */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
            <Check className="w-3 h-3 text-white" />
            <span>{experienceLevel}</span>
          </span>

          {companyType && (
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                companyType === 'Startup'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : companyType === 'Service'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {companyType === 'Startup' ? (
                <Rocket className="w-3 h-3 text-emerald-400" />
              ) : companyType === 'Service' ? (
                <Layers className="w-3 h-3 text-amber-400" />
              ) : (
                <Box className="w-3 h-3 text-indigo-400" />
              )}
              <span>{companyType === 'Startup' ? 'Startup' : `${companyType} Based`}</span>
            </span>
          )}
        </div>

        {/* Row 2 Badges: Location (Truncated) & Days Ago */}
        <div className="flex items-center gap-2 mb-3 min-w-0">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800 min-w-0 flex-1">
            <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </span>

          {isFresh ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white text-black flex-shrink-0">
              <Clock className="w-3 h-3 text-black flex-shrink-0" />
              <span className="whitespace-nowrap">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 flex-shrink-0">
              <Clock className="w-3 h-3 text-zinc-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{daysAgo}d ago</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Row */}
      <div className="pt-3 mt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-500 flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-zinc-600" />
          <span>
            {new Date(postedDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </span>

        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all active:scale-95"
        >
          <span>Apply Official Site</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default JobCard;
