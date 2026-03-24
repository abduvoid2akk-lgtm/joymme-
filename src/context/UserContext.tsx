import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  users: User[];
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  topUpBalance: (amount: number, method: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@uybozor.uz',
    phone: '+998 90 123 45 67',
    role: 'admin',
    balance: 1000000,
    paymentHistory: [],
    createdAt: Date.now() - 10000000,
  },
  {
    id: '2',
    name: 'Test User',
    username: 'user1',
    email: 'user@uybozor.uz',
    phone: '+998 91 777 88 99',
    role: 'user',
    balance: 50000,
    paymentHistory: [],
    createdAt: Date.now() - 5000000,
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const login = useCallback((userData: User) => setUser(userData), []);
  const logout = useCallback(() => setUser(null), []);
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
    setUsers((prev) => prev.map(u => u.id === user?.id ? { ...u, ...updates } : u));
  }, [user?.id]);

  const topUpBalance = useCallback((amount: number, method: string) => {
    if (!user) return;
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      method,
      type: 'topup' as const,
      description: `Balansni to'ldirish (${method})`,
      timestamp: Date.now(),
    };
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      paymentHistory: [newRecord, ...user.paymentHistory],
    };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  }, [user]);

  const blockUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: true } : u));
  }, []);

  const unblockUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: false } : u));
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      updateProfile, 
      topUpBalance,
      blockUser, 
      unblockUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
