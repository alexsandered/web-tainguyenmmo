import React from 'react';
import { LayoutGrid, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">DigiHub</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              Hệ thống cung cấp tài khoản Premium tự động hàng đầu. Cam kết chất lượng, bảo hành uy tín và hỗ trợ khách hàng 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Chính sách</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail size={16} className="text-indigo-400" />
                support@digihub.vn
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone size={16} className="text-indigo-400" />
                1900 1234
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <MapPin size={16} className="text-indigo-400" />
                Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} DigiHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Telegram</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Zalo</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
