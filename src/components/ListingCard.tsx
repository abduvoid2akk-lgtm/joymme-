import React from 'react';
import { Heart, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Listing } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { useListings } from '../context/ListingsContext';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { favorites, toggleFavorite } = useListings();
  const isLiked = favorites.includes(listing.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5 group flex flex-col h-full"
    >
      <Link to={`/listing/${listing.id}`} className="block relative aspect-[4/5] overflow-hidden m-2 rounded-[32px]">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {listing.isVip && (
            <span className="bg-[#FFD700] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              VIP
            </span>
          )}
          {listing.isTop && (
            <span className="bg-[#5842ff] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              TOP
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing.id);
          }}
          className={`absolute top-4 right-4 w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
            isLiked ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-black/20 text-white hover:bg-black/40"
          }`}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="p-4 md:p-6 pt-2 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-[10px] md:text-[12px] font-black text-emerald-600 uppercase tracking-widest mb-2 md:mb-3">
          <Tag size={12} className="md:w-[14px]" />
          <span>{listing.category}</span>
        </div>
        
        <div className="mb-1 md:mb-2">
          <span className="text-lg md:text-2xl font-black text-gray-900 block leading-none">$ {listing.price.toLocaleString()}</span>
        </div>

        <h3 className="text-xs md:text-lg font-black text-gray-900 line-clamp-1 mb-1 md:mb-2 group-hover:text-emerald-600 transition-colors">
          {listing.title}
        </h3>
        
        <div className="mt-auto flex items-center gap-1 md:gap-2 text-gray-400 text-[10px] md:text-sm font-medium">
          <MapPin size={10} className="shrink-0 md:w-[14px]" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>
      </div>
    </motion.div>
  );
};
