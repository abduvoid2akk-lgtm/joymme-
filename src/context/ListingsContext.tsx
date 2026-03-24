import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../mockData';

interface ListingsContextType {
  listings: Listing[];
  favorites: string[];
  history: string[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addToHistory: (id: string) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const addListing = useCallback((listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  }, []);

  const updateListing = useCallback((id: string, updates: Partial<Listing>) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const addToHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(hid => hid !== id);
      return [id, ...filtered].slice(0, 50); // Keep last 50
    });
  }, []);

  return (
    <ListingsContext.Provider value={{ 
      listings, 
      favorites, 
      history, 
      addListing, 
      updateListing, 
      deleteListing,
      toggleFavorite, 
      addToHistory 
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) throw new Error('useListings must be used within a ListingsProvider');
  return context;
};
