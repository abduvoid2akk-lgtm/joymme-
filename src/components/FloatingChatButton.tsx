import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const FloatingChatButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      drag
      dragConstraints={{ left: -window.innerWidth + 80, right: 0, top: -window.innerHeight + 80, bottom: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] cursor-move"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <button
        onClick={() => navigate('/chat')}
        className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:bg-emerald-700 transition-colors border-4 border-white"
      >
        <MessageCircle size={32} />
      </button>
    </motion.div>
  );
};
