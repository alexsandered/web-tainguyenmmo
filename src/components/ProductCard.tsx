import React from 'react';
import { calculatePrice } from '../utils';
import { ShoppingCart, Info } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    base_price: number;
    stock: number;
    warranty_type: string;
  };
  onBuy: (product: any, finalPrice: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  const { vnd, usdt } = calculatePrice(product.base_price);
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-5 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] ${isOutOfStock ? 'opacity-60 grayscale-[50%]' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-zinc-100 leading-tight line-clamp-2 pr-2">{product.name}</h3>
        
        <div className="flex flex-col gap-2 items-end shrink-0">
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${isOutOfStock ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock}`}
          </span>
          
          <div className="group relative">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${product.warranty_type === 'BHF' ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10' : 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10'} cursor-help`}>
              {product.warranty_type}
            </span>
            <div className="absolute bottom-full right-0 mb-2 hidden w-48 p-2 bg-zinc-800 text-xs text-zinc-300 rounded shadow-xl border border-white/10 group-hover:block z-10">
              {product.warranty_type === 'BHF' ? 'Bảo hành Full thời gian sử dụng' : 'Không bảo hành sau khi mua'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-white">
            {new Intl.NumberFormat('vi-VN').format(vnd)} <span className="text-sm font-normal text-zinc-400">đ</span>
          </div>
          <div className="text-sm text-zinc-500 font-medium">
            ~ {usdt} USDT
          </div>
        </div>
        
        <button 
          onClick={() => onBuy(product, vnd)}
          disabled={isOutOfStock}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            isOutOfStock 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95'
          }`}
        >
          <ShoppingCart size={16} />
          Mua Ngay
        </button>
      </div>
    </div>
  );
};
