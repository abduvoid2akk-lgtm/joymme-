import React from 'react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';
import { TrendingUp } from 'lucide-react';

interface TopSectionProps {
  listings: Listing[];
}

export const TopSection: React.FC<TopSectionProps> = ({ listings }) => {
  if (listings.length === 0) return null;

  return (
    <section className="space-y-6 pt-8 border-t border-black/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100 shrink-0">
            <TrendingUp size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">TOP E'LONLAR</h2>
            <p className="text-[10px] md:text-sm text-gray-500 font-medium">Ko'p ko'rilgan va ommabop uylar</p>
          </div>
        </div>
        <button className="text-emerald-600 font-black text-sm md:text-base hover:opacity-80 transition-opacity shrink-0">Barchasi</button>
      </div>
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 px-4 md:px-0 no-scrollbar snap-x snap-mandatory">
        {listings.map((listing) => (
          <div key={listing.id} className="min-w-[240px] md:min-w-[280px] snap-start">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
};
