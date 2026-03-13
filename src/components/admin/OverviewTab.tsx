import React from 'react';
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';

export const OverviewTab = () => {
  const stats = [
    { label: 'Tổng doanh thu', value: '125.500.000đ', subValue: '~ 5,020 USDT', icon: <DollarSign size={24} className="text-emerald-400" />, bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Đơn hàng Pending', value: '12', subValue: 'Cần xử lý ngay', icon: <ShoppingBag size={24} className="text-amber-400" />, bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { label: 'Tổng số User', value: '1,248', subValue: '+24 hôm nay', icon: <Users size={24} className="text-indigo-400" />, bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
    { label: 'Sắp hết hàng (< 5)', value: '8', subValue: 'Sản phẩm', icon: <AlertTriangle size={24} className="text-rose-400" />, bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className={`p-6 rounded-2xl bg-zinc-900/50 border ${stat.border} backdrop-blur-sm`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
          <h3 className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">{stat.subValue}</p>
        </div>
      ))}
    </div>
  );
};
