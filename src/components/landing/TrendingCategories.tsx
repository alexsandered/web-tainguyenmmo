import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Film, Shield, PenTool, TrendingUp, Facebook } from 'lucide-react';

const categories = [
  {
    icon: <Cpu size={32} className="text-indigo-400" />,
    name: 'AI Tools',
    price: '20.000đ',
    bg: 'from-indigo-500/20 to-indigo-900/10',
    border: 'border-indigo-500/20',
    hover: 'hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]'
  },
  {
    icon: <Film size={32} className="text-rose-400" />,
    name: 'Entertainment',
    price: '52.000đ',
    bg: 'from-rose-500/20 to-rose-900/10',
    border: 'border-rose-500/20',
    hover: 'hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]'
  },
  {
    icon: <Facebook size={32} className="text-blue-400" />,
    name: 'Facebook',
    price: '15.000đ',
    bg: 'from-blue-500/20 to-blue-900/10',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]'
  },
  {
    icon: <Shield size={32} className="text-emerald-400" />,
    name: 'VPN & Proxy',
    price: '18.000đ',
    bg: 'from-emerald-500/20 to-emerald-900/10',
    border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  {
    icon: <PenTool size={32} className="text-amber-400" />,
    name: 'Design & Video',
    price: '16.000đ',
    bg: 'from-amber-500/20 to-amber-900/10',
    border: 'border-amber-500/20',
    hover: 'hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  {
    icon: <TrendingUp size={32} className="text-sky-400" />,
    name: 'Marketing & Social',
    price: '20.000đ',
    bg: 'from-sky-500/20 to-sky-900/10',
    border: 'border-sky-500/20',
    hover: 'hover:border-sky-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]'
  }
];

interface TrendingProps {
  onRequireAuth: () => void;
}

export const TrendingCategories: React.FC<TrendingProps> = ({ onRequireAuth }) => {
  return (
    <section id="products" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Danh mục nổi bật</h2>
            <p className="text-zinc-400">Khám phá hàng loạt tài khoản Premium với mức giá không thể tốt hơn. Đăng nhập để xem toàn bộ danh sách.</p>
          </div>
          <button
            onClick={onRequireAuth}
            className="px-6 py-3 text-sm font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-colors whitespace-nowrap"
          >
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={onRequireAuth}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.bg} border ${cat.border} p-6 transition-all duration-300 ${cat.hover}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500">
                {cat.icon}
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950/50 backdrop-blur-md flex items-center justify-center mb-4 border border-white/5">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                </div>
                
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Chỉ từ</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white">{cat.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
