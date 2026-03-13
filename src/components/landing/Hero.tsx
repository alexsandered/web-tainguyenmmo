import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onRegister }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image (Replace URL with your Midjourney generation) */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1920&auto=format&fit=crop')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            Nâng Tầm Trải Nghiệm Số Của Bạn Cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">DigiHub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Hệ thống cung cấp tài khoản Premium (AI, Giải trí, VPN, Design) tự động 100%. Nhận tài khoản ngay sau 5 giây thanh toán.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Khám phá Sản phẩm
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onRegister}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <PlayCircle size={18} />
              Tạo tài khoản miễn phí
            </button>
          </motion.div>
        </div>

        {/* Floating Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 50 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="p-4 md:p-8 opacity-50 blur-[2px] hover:blur-none hover:opacity-100 transition-all duration-500">
              {/* Mockup Content */}
              <div className="flex gap-6">
                <div className="w-48 hidden md:block space-y-4">
                  <div className="h-8 bg-white/5 rounded-lg w-full" />
                  <div className="h-8 bg-white/5 rounded-lg w-full" />
                  <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between">
                    <div className="h-8 bg-white/5 rounded-lg w-1/3" />
                    <div className="h-8 bg-white/5 rounded-lg w-1/4" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-40 bg-white/5 rounded-xl border border-white/5" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
