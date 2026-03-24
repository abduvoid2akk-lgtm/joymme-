import { useState, useEffect } from 'react';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../mockData';

export const useFetchListings = () => {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_LISTINGS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};
