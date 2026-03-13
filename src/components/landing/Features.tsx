import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Tag, LockKeyhole } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} className="text-amber-400" />,
    title: 'Tự động 24/7',
    description: 'Nạp tiền & Trả đơn tự động. Nhận tài khoản ngay lập tức bất kể ngày đêm.',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20'
  },
  {
    icon: <ShieldCheck size={24} className="text-emerald-400" />,
    title: 'Bảo hành uy tín',
    description: 'Cam kết 1 đổi 1 trong suốt thời gian sử dụng. Hỗ trợ nhiệt tình, nhanh chóng.',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  },
  {
    icon: <Tag size={24} className="text-indigo-400" />,
    title: 'Giá tốt nhất',
    description: 'Tiết kiệm đến 80% so với mua gốc. Cập nhật giá liên tục để đảm bảo ưu đãi.',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20'
  },
  {
    icon: <LockKeyhole size={24} className="text-rose-400" />,
    title: 'Bảo mật tuyệt đối',
    description: 'Không lưu trữ thông tin thanh toán. Dữ liệu cá nhân được mã hóa an toàn.',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tại sao chọn chúng tôi?</h2>
          <p className="text-zinc-400">DigiHub mang đến giải pháp tối ưu cho nhu cầu sử dụng tài nguyên số của bạn với cam kết chất lượng hàng đầu.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              <div className={`h-full p-6 rounded-2xl bg-zinc-900/50 border ${feature.border} backdrop-blur-sm hover:border-white/20 transition-colors`}>
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
