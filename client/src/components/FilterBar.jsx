import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown, Building2, RotateCcw, Box, Layers, LayoutGrid, Rocket } from 'lucide-react';

const FilterBar = ({
  search,
  setSearch,
  selectedCompany,
  setSelectedCompany,
  companiesList = [],
  companyType = 'ALL',
  setCompanyType,
  indiaOnly = false,
  setIndiaOnly,
  fresherOnly,
  setFresherOnly,
  showArchived,
  setShowArchived,
  onReset
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const dropdownRef = useRef(null);

  const isFiltered = search || selectedCompany || (companyType && companyType !== 'ALL') || indiaOnly || !fresherOnly || showArchived;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCompanies = companiesList.filter(c =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="mono-panel p-4 rounded-xl border border-zinc-800 space-y-3.5 mb-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, company, skill..."
            className="w-full pl-9 pr-8 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Custom Modern App Dropdown */}
        <div className="sm:col-span-4 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-xl text-xs text-left flex items-center justify-between transition-all ${
              dropdownOpen
                ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 text-white'
                : selectedCompany
                ? 'border-zinc-700 text-white'
                : 'border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center space-x-2 truncate pr-2">
              <Building2 className={`w-4 h-4 flex-shrink-0 ${selectedCompany ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span className="truncate">
                {selectedCompany || 'All Companies'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Modern Dropdown Popover */}
          {dropdownOpen && (
            <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Quick Search inside Dropdown */}
              {companiesList.length > 4 && (
                <div className="px-2 pb-1.5 border-b border-zinc-800/80">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      placeholder="Filter company..."
                      className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-56 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany('');
                    setDropdownOpen(false);
                    setCompanySearch('');
                  }}
                  className={`w-full px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    !selectedCompany
                      ? 'bg-zinc-800/80 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span>All Companies</span>
                  {!selectedCompany && <Check className="w-3.5 h-3.5 text-white" />}
                </button>

                {filteredCompanies.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-zinc-500 text-center">
                    No matching company
                  </div>
                ) : (
                  filteredCompanies.map((comp) => {
                    const isSelected = selectedCompany === comp;
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => {
                          setSelectedCompany(comp);
                          setDropdownOpen(false);
                          setCompanySearch('');
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <span className="truncate">{comp}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="sm:col-span-3 flex flex-wrap items-center justify-between sm:justify-end gap-1.5">
          
          {setIndiaOnly && (
            <button
              type="button"
              onClick={() => setIndiaOnly(!indiaOnly)}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 whitespace-nowrap ${
                indiaOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <span>🇮🇳 India Only</span>
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${indiaOnly ? 'bg-emerald-500 text-black' : 'bg-zinc-800'}`}>
                {indiaOnly && <Check className="w-2 h-2 stroke-[3]" />}
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => setFresherOnly(!fresherOnly)}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 whitespace-nowrap ${
              fresherOnly
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>Fresher</span>
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${fresherOnly ? 'bg-black text-white' : 'bg-zinc-800'}`}>
              {fresherOnly && <Check className="w-2 h-2 stroke-[3]" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all active:scale-95 whitespace-nowrap ${
              showArchived
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <span>Archived</span>
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${showArchived ? 'bg-black text-white' : 'bg-zinc-800'}`}>
              {showArchived && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 text-xs text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors flex-shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>

      {/* Company Type Filter Pills Row */}
      <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-400 flex items-center space-x-1.5 whitespace-nowrap">
          <Building2 className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span className="whitespace-nowrap">Company Category:</span>
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCompanyType && setCompanyType('ALL')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              !companyType || companyType === 'ALL'
                ? 'bg-zinc-800 text-white border-zinc-700 font-semibold shadow-inner'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="whitespace-nowrap">All</span>
          </button>

          <button
            type="button"
            onClick={() => setCompanyType && setCompanyType('Product')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              companyType === 'Product'
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-bold shadow-sm shadow-indigo-500/10'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Product</span>
          </button>

          <button
            type="button"
            onClick={() => setCompanyType && setCompanyType('Service')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              companyType === 'Service'
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 font-bold shadow-sm shadow-amber-500/10'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Service</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCompanyType && setCompanyType('Startup')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              companyType === 'Startup'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm shadow-emerald-500/10'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="whitespace-nowrap">Startup</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default FilterBar;
