import React from 'react';
import { useListings } from '../../context/ListingsContext';
import { Check, X, Eye, Clock } from 'lucide-react';

export const AdminPendingListings: React.FC = () => {
  const { listings, updateListing } = useListings();
  const pendingListings = listings.filter(l => l.status === 'pending');

  const handleApprove = (id: string) => {
    updateListing(id, { status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateListing(id, { status: 'rejected' });
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Kutilayotgan e'lonlar</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Tasdiqlashni kutayotgan yangi e'lonlar ro'yxati</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-black/5">
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">E'lon</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Narxi</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategoriya</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joylashuv</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {pendingListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center">
                      <Clock className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Kutilayotgan e'lonlar yo'q</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center space-x-5">
                        <img src={listing.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                        <span className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{listing.title}</span>
                      </div>
                    </td>
                    <td className="p-8 font-black text-gray-900 text-lg">${listing.price.toLocaleString()}</td>
                    <td className="p-8">
                      <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600">
                        {listing.category}
                      </span>
                    </td>
                    <td className="p-8 text-sm font-bold text-gray-400">{listing.location}</td>
                    <td className="p-8">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleApprove(listing.id)}
                          className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90 shadow-lg shadow-emerald-100"
                          title="Tasdiqlash"
                        >
                          <Check className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleReject(listing.id)}
                          className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-lg shadow-red-100"
                          title="Rad etish"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all active:scale-90">
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
