import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, GraduationCap, Bookmark, MapPin } from 'lucide-react';

const BottomNav = ({ savedCount = 0 }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/kerala-jobs', label: 'Kerala', icon: MapPin },
    { path: '/exams', label: 'Exams', icon: GraduationCap },
    { path: '/saved', label: 'Saved', icon: Bookmark, count: savedCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-emerald-950/30 to-black backdrop-blur-2xl border-t border-emerald-500/20 px-3 py-2 flex items-center justify-around shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.95)] transition-all duration-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => e.currentTarget.blur()}
            onFocus={(e) => e.target.blur()}
            className={`flex-1 flex flex-col items-center justify-center space-y-1 py-2 px-2 rounded-2xl transition-all duration-200 ease-out active:scale-95 relative border-0 border-none outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none [-webkit-tap-highlight-color:transparent] ${
              active
                ? 'text-white bg-zinc-900/90 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  active ? 'text-emerald-400 scale-110' : 'text-zinc-400'
                }`}
              />
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-white text-black shadow-sm font-mono animate-in zoom-in-50 duration-150">
                  {item.count}
                </span>
              )}
            </div>
            <span
              className={`text-[11px] tracking-tight capitalize transition-colors duration-200 ${
                active ? 'font-bold text-white' : 'font-medium text-zinc-400'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>

  );
};

export default BottomNav;
