import React from 'react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';
import { Crown } from 'lucide-react';

interface VIPSectionProps {
  listings: Listing[];
}

export const VIPSection: React.FC<VIPSectionProps> = ({ listings }) => {
  if (listings.length === 0) return null;

  // Limit to 10 listings
  const displayListings = listings.slice(0, 10);

  return (
    <section className="space-y-4 pt-8 border-t border-black/5">
      <div className="flex items-center justify-between gap-4 px-4 md:px-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-lg shadow-amber-100 shrink-0">
            <Crown size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase">VIP E'LONLAR</h2>
            <p className="text-[9px] md:text-xs text-gray-500 font-medium">Eng sara premium e'lonlar</p>
          </div>
        </div>
        <button className="text-emerald-600 font-black text-xs md:text-sm hover:opacity-80 transition-opacity shrink-0">Barchasi</button>
      </div>
      
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 px-4 md:px-0 no-scrollbar snap-x snap-mandatory">
        {displayListings.map((listing) => (
          <div key={listing.id} className="min-w-[180px] md:min-w-[220px] snap-start scale-95 origin-left">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
};
