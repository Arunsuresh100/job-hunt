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
  } = exam;

  if (variant === 'saved') {
    return (
      <div className="bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/90 p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative group transition-all duration-200 shadow-md">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-zinc-950 text-zinc-300 border border-zinc-800/80 capitalize">
                  {category ? capitalizeText(category) : 'Exam'}
                </span>

                {isUrgent && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 capitalize">
                    <AlertCircle className="w-3 h-3 text-pink-400" />
                    <span>Closing In {daysRemaining}d!</span>
                  </span>
                )}

                {isExpired && (
                  <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-800/80 capitalize">
                    Closed
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors capitalize">
                {capitalizeText(name)}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 capitalize">
                Conducted By: <strong className="text-zinc-200">{capitalizeText(conductingBody)}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleSave && onToggleSave('EXAM', id)}
              className={`p-2 rounded-xl border transition-all active:scale-90 flex-shrink-0 ${
                isSaved
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Exam'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {description && (
            <p className="text-xs text-zinc-400 line-clamp-2 my-3 bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 leading-relaxed capitalize">
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
              <span className={`font-bold ${isUrgent ? 'text-pink-400 underline' : 'text-zinc-200'}`}>
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
          {onEdit ? (
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
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-all active:scale-95 capitalize"
          >
            <span>Official Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Original Old Design for Exam Page
  return (
    <div className="mono-card p-5 rounded-xl flex flex-col justify-between relative group">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                {category || 'Exam'}
              </span>

              {isUrgent && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white text-black">
                  <AlertCircle className="w-3 h-3 text-black" />
                  <span>Closing in {daysRemaining}d!</span>
                </span>
              )}

              {isExpired && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                  Closed
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-zinc-300 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Conducted by: <strong>{conductingBody}</strong>
            </p>
          </div>

          <button
            onClick={() => onToggleSave && onToggleSave('EXAM', id)}
            className={`p-1.5 rounded-lg border transition-all ${
              isSaved
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Exam'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {description && (
          <p className="text-xs text-zinc-400 line-clamp-2 my-2.5 bg-zinc-950 p-2.5 rounded border border-zinc-800">
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
            <span className={`font-bold ${isUrgent ? 'text-white underline' : 'text-zinc-200'}`}>
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
        {onEdit ? (
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
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-all"
        >
          <span>Official Link</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ExamCard;


