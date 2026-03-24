import React from 'react';
import { Search, SlidersHorizontal, Map as MapIcon, MessageCircle } from 'lucide-react';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (c: Category | 'all') => void;
  onOpenFilters: () => void;
  activeTab: 'Sotuv' | 'Ijara' | 'Kunlik';
  setActiveTab: (tab: 'Sotuv' | 'Ijara' | 'Kunlik') => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenFilters,
  activeTab,
  setActiveTab,
}) => {
  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Barchasi' },
    { id: 'uy', label: 'Hovli' },
    { id: 'dom', label: 'Dom' },
    { id: 'kvartira', label: 'Kvartira' },
    { id: 'boshqa', label: 'Boshqa' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Search & Filter - Image Background Style */}
      <div className="relative p-4 md:p-8 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden border border-black/5 space-y-4 md:space-y-6 bg-white/90 backdrop-blur-xl">
        <div className="relative z-10 space-y-4 md:space-y-6">
          {/* Categories at the top of the banner */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 justify-start md:justify-center pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[12px] font-black transition-all uppercase tracking-widest border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                    : 'bg-white text-gray-500 border-black/5 hover:bg-white hover:text-gray-900 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full bg-gray-50 border-none rounded-[20px] md:rounded-[28px] py-3 md:py-4 pl-12 md:pl-16 pr-4 md:pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-sm md:text-lg font-bold placeholder:text-gray-500 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={onOpenFilters}
              className="bg-emerald-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-[20px] md:rounded-[28px] font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              <SlidersHorizontal size={20} />
              <span className="text-sm md:text-base uppercase tracking-widest">Filter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
