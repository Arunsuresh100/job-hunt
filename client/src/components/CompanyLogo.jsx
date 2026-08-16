import React, { useState } from 'react';

const getCompanyGradient = (name = '') => {
  const gradients = [
    'from-indigo-600 to-violet-700 text-white',
    'from-blue-600 to-cyan-700 text-white',
    'from-emerald-600 to-teal-700 text-white',
    'from-purple-600 to-pink-700 text-white',
    'from-amber-600 to-orange-700 text-white',
    'from-rose-600 to-red-700 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const getInitials = (name = '') => {
  if (!name) return 'CO';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const CompanyLogo = ({ logoUrl, company, applyUrl, className = "w-10 h-10" }) => {
  const [stage, setStage] = useState(0); // 0 = logoUrl, 1 = google favicon, 2 = initials fallback

  const cleanDomain = () => {
    if (applyUrl && applyUrl.startsWith('http')) {
      try {
        const u = new URL(applyUrl);
        const host = u.hostname.replace(/^www\./, '');
        const generic = ['remotive.com', 'arbeitnow.com', 'jobicy.com', 'adzuna.com', 'github.com', 'linkedin.com'];
        if (!generic.some(g => host.includes(g))) {
          return host;
        }
      } catch (e) {}
    }
    const cleanComp = (company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanComp ? `${cleanComp}.com` : 'google.com';
  };

  const getPrimarySrc = () => {
    if (logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('http')) {
      return logoUrl;
    }
    return `https://logo.clearbit.com/${cleanDomain()}`;
  };

  const getSecondarySrc = () => {
    return `https://www.google.com/s2/favicons?domain=https://${cleanDomain()}&sz=128`;
  };

  if (stage === 0) {
    return (
      <div className={`${className} rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 relative group-hover:border-zinc-700 transition-colors shadow-inner`}>
        <img
          src={getPrimarySrc()}
          alt={company}
          className="w-full h-full object-contain rounded-lg"
          onError={() => setStage(1)}
        />
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className={`${className} rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 relative group-hover:border-zinc-700 transition-colors shadow-inner`}>
        <img
          src={getSecondarySrc()}
          alt={company}
          className="w-full h-full object-contain rounded-lg"
          onError={() => setStage(2)}
        />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-xl bg-zinc-950 border border-zinc-800 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner`}>
      <div className={`w-full h-full rounded-lg bg-gradient-to-br ${getCompanyGradient(company)} flex items-center justify-center font-bold text-xs shadow-inner`}>
        {getInitials(company)}
      </div>
    </div>
  );
};

export default CompanyLogo;
