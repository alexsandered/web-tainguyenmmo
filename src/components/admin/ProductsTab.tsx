import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data
const initialProducts = [
  { id: 1, name: 'Chat GPT Plus 1 Tháng (KBH)', category: 'AI Tools', basePrice: 20000, price: 26000, stock: 15, warranty: 'KBH', isActive: true, discount: 0 },
  { id: 2, name: 'Netflix Premium 4K 1 Tháng', category: 'Entertainment', basePrice: 140000, price: 168000, stock: 3, warranty: 'BHF', isActive: true, discount: 10 },
  { id: 3, name: 'Nord VPN 1 Năm 1 Thiết Bị', category: 'VPN & Proxy', basePrice: 156000, price: 187000, stock: 0, warranty: 'BHF', isActive: false, discount: 0 },
];

export const ProductsTab = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleToggleActive = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const openModal = (product: any = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-semibold text-zinc-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Kho</th>
                <th className="px-6 py-4">Bảo hành</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {product.name}
                    {product.discount > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">
                        <Tag size={10} /> -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-white font-medium">{(product.price * (1 - product.discount/100)).toLocaleString()}đ</span>
                        <span className="text-zinc-500 line-through text-xs ml-2">{product.price.toLocaleString()}đ</span>
                      </div>
                    ) : (
                      <span className="text-white font-medium">{product.price.toLocaleString()}đ</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' : product.stock > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.warranty === 'BHF' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {product.warranty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(product.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.isActive ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-4.5' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(product)} className="text-zinc-400 hover:text-indigo-400 transition-colors p-1">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-zinc-400 hover:text-rose-400 transition-colors p-1 ml-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Tên sản phẩm</label>
                  <input type="text" defaultValue={editingProduct?.name} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Danh mục</label>
                    <select defaultValue={editingProduct?.category} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none">
                      <option>AI Tools</option>
                      <option>Entertainment</option>
                      <option>Facebook</option>
                      <option>VPN & Proxy</option>
                      <option>Design & Video</option>
                      <option>Marketing & Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Loại bảo hành</label>
                    <select defaultValue={editingProduct?.warranty} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none">
                      <option value="BHF">Bảo hành Full (BHF)</option>
                      <option value="KBH">Không bảo hành (KBH)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Giá gốc (VND)</label>
                    <input type="number" defaultValue={editingProduct?.basePrice} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Kho (Stock)</label>
                    <input type="number" defaultValue={editingProduct?.stock} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Giảm giá (%) - Tính năng SALE</label>
                  <input type="number" defaultValue={editingProduct?.discount || 0} min="0" max="100" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                  Hủy
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
