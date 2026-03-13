import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">DigiHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Tính năng</a>
          <a href="#products" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sản phẩm</a>
          <a href="#reviews" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Đánh giá</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 text-sm font-medium text-white border border-white/10 hover:bg-white/5 rounded-xl transition-colors"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
