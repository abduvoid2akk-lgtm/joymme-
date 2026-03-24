import React, { useState } from 'react';
import { useListings } from '../context/ListingsContext';
import { MapWithRadius } from '../components/MapWithRadius';
import { ListingCard } from '../components/ListingCard';
import { List, Map as MapIcon, Search as SearchIcon, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const { listings } = useListings();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const approvedListings = listings.filter(l => l.status === 'approved');

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col -mx-4 md:-mx-8">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MapWithRadius 
                listings={approvedListings} 
                onToggleView={() => setViewMode('list')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-90"
                  >
                    <ChevronLeft size={24} className="text-gray-900" />
                  </button>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">E'LONLAR RO'YXATI</h1>
                </div>
                <button
                  onClick={() => setViewMode('map')}
                  className="w-full sm:w-auto bg-gray-900 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-black shadow-xl active:scale-95 transition-all"
                >
                  <MapIcon size={18} />
                  <span>XARITAGA QAYTISH</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {approvedListings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
