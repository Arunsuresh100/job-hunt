import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-black py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold">
              <Briefcase className="w-3 h-3 text-black" />
            </div>
            <span className="text-white font-sans font-bold">FreshJobs & Exams Tracker</span>
          </div>
          <p>© {new Date().getFullYear()} MCA & Fresher Portal. 7-Day Hard Filter Active.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
