import React from 'react';
import { useListings } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { Heart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Favorites: React.FC = () => {
  const { listings, favorites } = useListings();
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">SAQLANGANLAR</h1>
          <p className="text-gray-500 font-bold text-sm md:text-base uppercase tracking-widest">Sizga yoqqan barcha e'lonlar bir joyda</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-black/5 shadow-sm">
          <Heart size={18} className="text-red-500 fill-red-500" />
          <span className="font-black text-gray-900">{favoriteListings.length} ta e'lon</span>
        </div>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {favoriteListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 md:p-24 text-center border border-dashed border-gray-200 shadow-sm"
        >
          <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8">
            <Heart size={40} className="text-gray-200 md:w-16 md:h-16" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">Hali hech narsa saqlanmagan</h2>
          <p className="text-gray-500 font-bold mb-8 md:mb-10 max-w-md mx-auto text-sm md:text-base">
            O'zingizga yoqqan e'lonlarni saqlab qo'ying va ularni keyinroq osongina toping.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm md:text-base shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Home size={20} />
            E'lonlarni ko'rish
          </Link>
        </motion.div>
      )}
    </div>
  );
};
