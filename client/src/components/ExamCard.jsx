import React from 'react';
import { Calendar, ExternalLink, Bookmark, Clock, Award, AlertCircle } from 'lucide-react';

const capitalizeText = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const renderExamTitle = (rawName) => {
  if (!rawName) return null;
  const openParenIndex = rawName.indexOf('(');
  if (openParenIndex > 0) {
    const mainTitle = rawName.substring(0, openParenIndex).trim();
    const subTitle = rawName.substring(openParenIndex).trim();
    return (
      <span className="block">
        <span className="block">{mainTitle}</span>
        <span className="block text-xs sm:text-sm font-semibold text-emerald-400/95 mt-1 font-sans">
          {subTitle}
        </span>
      </span>
    );
  }
  return rawName;
};

const ExamCard = ({ exam, onToggleSave, onEdit, variant = 'default' }) => {
  const {
    id,
    name,
    conductingBody,
    category,
    notificationDate,
    applicationStartDate,
    applicationEndDate,
    examDate,
    officialUrl,
    description,
    daysRemaining,
    isUrgent,
    isExpired,
    isSaved,
    isCustom,
    isUserCreated,
  } = exam || {};

  const canEdit = onEdit && (isCustom || isUserCreated);

  if (variant === 'saved') {
    return (
      <div className="bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/90 p-5 sm:p-6 rounded-2xl flex flex-col justify-between relative group transition-all duration-200 shadow-md">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0 flex-1">
              {/* Single Line Badge Row */}
              <div className="flex items-center gap-1.5 mb-2 min-w-0">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-950 text-zinc-300 border border-zinc-800/80 truncate min-w-0 flex-1">
                  {category ? capitalizeText(category) : 'Exam'}
                </span>

                {isUrgent && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 whitespace-nowrap flex-shrink-0">
                    <AlertCircle className="w-3 h-3 text-pink-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">Closing in {daysRemaining}d!</span>
                  </span>
                )}

                {isExpired && (
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-800/80 whitespace-nowrap flex-shrink-0">
                    Closed
                  </span>
                )}
              </div>

              {/* Heading with parenthetical details starting on next line */}
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors capitalize my-2.5 sm:my-3 leading-snug">
                {renderExamTitle(name)}
              </h3>
              <p className="text-xs text-zinc-400 truncate mb-1">
                Conducted by: <strong className="text-zinc-200">{capitalizeText(conductingBody)}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave('EXAM', id)}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex-shrink-0 ${
                isSaved
                  ? 'bg-white text-black border-white shadow-md shadow-white/10 font-bold'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Exam'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-black' : ''}`} />
            </button>
          </div>

          {/* Full Readable Description (Not cut off) */}
          {description && (
            <p className="text-xs text-zinc-300 my-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 leading-relaxed font-normal">
              {description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 my-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs">
            <div>
              <span className="text-[10px] font-medium text-zinc-500 block capitalize tracking-tight">Notification</span>
              <span className="font-semibold text-zinc-200">
                {new Date(notificationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-medium text-zinc-500 block capitalize tracking-tight">Deadline</span>
              <span className={`font-bold ${isUrgent ? 'text-pink-400 font-extrabold' : 'text-zinc-200'}`}>
                {new Date(applicationEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-medium text-zinc-500 block capitalize tracking-tight">Exam Date</span>
              <span className="font-semibold text-zinc-300">
                {examDate ? new Date(examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          {canEdit ? (
            <button onClick={() => onEdit(exam)} className="text-xs text-zinc-400 hover:text-white font-medium underline capitalize">
              Edit
            </button>
          ) : (
            <span className="text-[11px] font-mono text-zinc-500 capitalize">Official Portal Verified</span>
          )}

          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-all active:scale-95 capitalize"
          >
            <span>Official Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Standard Job Portal Exam Card Design
  return (
    <div className="mono-card p-5 sm:p-6 rounded-xl flex flex-col justify-between relative group shadow-md">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0 flex-1">
            {/* Single Line Badge Row */}
            <div className="flex items-center gap-1.5 mb-2 min-w-0">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 truncate min-w-0 flex-1">
                {category || 'Exam'}
              </span>

              {isUrgent && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white text-black whitespace-nowrap flex-shrink-0">
                  <AlertCircle className="w-3 h-3 text-black flex-shrink-0" />
                  <span className="whitespace-nowrap">Closing in {daysRemaining}d!</span>
                </span>
              )}

              {isExpired && (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 whitespace-nowrap flex-shrink-0">
                  Closed
                </span>
              )}
            </div>

            {/* Heading with parenthetical details starting on next line */}
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors my-2.5 sm:my-3 leading-snug">
              {renderExamTitle(name)}
            </h3>
            <p className="text-xs text-zinc-400 truncate mb-1">
              Conducted by: <strong className="text-zinc-200">{conductingBody}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave('EXAM', id)}
            className={`p-1.5 rounded-lg border transition-all flex-shrink-0 ${
              isSaved
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Exam'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Full Readable Description (Not cut off) */}
        {description && (
          <p className="text-xs text-zinc-300 my-3 bg-zinc-950 p-3 rounded border border-zinc-800 leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* Dates Grid */}
        <div className="grid grid-cols-3 gap-2 my-3 bg-zinc-950 p-3 rounded border border-zinc-800 text-xs">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 block">Notification</span>
            <span className="font-semibold text-zinc-200">
              {new Date(notificationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-500 block">App Deadline</span>
            <span className={`font-bold ${isUrgent ? 'text-emerald-400 font-extrabold' : 'text-zinc-200'}`}>
              {new Date(applicationEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-500 block">Exam Date</span>
            <span className="font-semibold text-zinc-300">
              {examDate ? new Date(examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        {canEdit ? (
          <button onClick={() => onEdit(exam)} className="text-xs text-zinc-400 hover:text-white font-medium underline">
            Edit
          </button>
        ) : (
          <span className="text-[11px] font-mono text-zinc-500">Official Portal Verified</span>
        )}

        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all active:scale-95"
        >
          <span>Official Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ExamCard;
