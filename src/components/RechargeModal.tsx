import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check } from 'lucide-react';

interface RechargeModalProps {
  userId: number;
  onClose: () => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({ userId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const transferContent = `NAPTIEN ${userId}`;
  const bankAccount = "123456789";
  const bankName = "MBBank";
  const accountName = "NGUYEN VAN A";

  // Using VietQR format for dynamic QR
  const qrUrl = `https://img.vietqr.io/image/MB-${bankAccount}-compact2.png?amount=50000&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(transferContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Nạp Tiền Tự Động</h2>
          <p className="text-zinc-400 text-sm mb-6">Quét mã QR bằng ứng dụng ngân hàng hoặc Momo. Hệ thống sẽ cộng tiền tự động sau 1-3 phút.</p>
          
          <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
          </div>

          <div className="space-y-3 text-left bg-zinc-800/50 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Ngân hàng</span>
              <span className="text-zinc-200 font-medium">{bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Chủ tài khoản</span>
              <span className="text-zinc-200 font-medium">{accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Số tài khoản</span>
              <span className="text-zinc-200 font-medium">{bankAccount}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Nội dung CK</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold tracking-wider">{transferContent}</span>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-amber-400/80 bg-amber-400/10 p-3 rounded-lg text-left">
            <span className="font-bold">Lưu ý:</span> Bắt buộc nhập đúng nội dung chuyển khoản để hệ thống tự động nhận diện.
          </div>
        </div>
      </div>
    </div>
  );
};
