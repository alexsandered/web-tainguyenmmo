import React, { useState } from 'react';
import { Megaphone, Save } from 'lucide-react';

interface AnnouncementsTabProps {
  currentAnnouncement: string;
  showOnLanding: boolean;
  showOnDashboard: boolean;
  onSave: (announcement: string, landing: boolean, dashboard: boolean) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ currentAnnouncement, showOnLanding, showOnDashboard, onSave }) => {
  const [text, setText] = useState(currentAnnouncement);
  const [landing, setLanding] = useState(showOnLanding);
  const [dashboard, setDashboard] = useState(showOnDashboard);

  return (
    <div className="max-w-3xl">
      <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Cài đặt Thông báo (Global Announcement)</h2>
            <p className="text-sm text-zinc-400">Thông báo sẽ hiển thị ở banner trên cùng của trang web.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Nội dung thông báo (Hỗ trợ HTML/Emoji)</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Ví dụ: 🚀 Siêu Sale cuối tuần! Giảm giá 50% tất cả tài khoản Netflix..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Vị trí hiển thị</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={landing} onChange={(e) => setLanding(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 border border-zinc-600 rounded bg-zinc-950 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Trang chủ (Landing Page)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={dashboard} onChange={(e) => setDashboard(e.target.checked)} className="peer sr-only" />
                  <div className="w-5 h-5 border border-zinc-600 rounded bg-zinc-950 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Trang User (Sau đăng nhập)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => onSave(text, landing, dashboard)}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              <Save size={18} />
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
