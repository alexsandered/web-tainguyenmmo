import React, { useState, useEffect, useMemo } from 'react';
import { Search, Wallet, History, LayoutGrid, Bell, LogOut } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { OrderHistory } from './components/OrderHistory';
import { RechargeModal } from './components/RechargeModal';
import { categorizeProduct } from './utils';

export default function DashboardApp({ onLogout, onSwitchToAdmin }: { onLogout?: () => void, onSwitchToAdmin?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'home' | 'history'>('home');
  const [showRecharge, setShowRecharge] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const eventSource = new EventSource(`/api/sse/${user.id}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'RECHARGE_SUCCESS') {
          setUser((prev: any) => ({ ...prev, balance: data.newBalance }));
          addNotification(`Nạp thành công ${new Intl.NumberFormat('vi-VN').format(data.amount)}đ`);
        } else if (data.type === 'BALANCE_UPDATE') {
          setUser((prev: any) => ({ ...prev, balance: data.newBalance }));
        } else if (data.type === 'ORDER_COMPLETED') {
          addNotification(`Đơn hàng #${data.orderId} đã hoàn thành!`);
        } else if (data.type === 'ORDER_FAILED') {
          addNotification(`Đơn hàng #${data.orderId} thất bại (Hết hàng).`);
          fetchUser(); // Refresh balance
        }
      };

      return () => eventSource.close();
    }
  }, [user?.id]);

  const fetchUser = async () => {
    const res = await fetch('/api/user');
    const data = await res.json();
    setUser(data);
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const handleBuy = async (product: any, finalPrice: number) => {
    if (!user) return;
    if (user.balance < finalPrice) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền!');
      setShowRecharge(true);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, price: finalPrice })
      });
      const data = await res.json();
      
      if (data.success) {
        addNotification(`Đã đặt mua ${product.name}. Đang xử lý...`);
        setView('history');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi mua hàng.');
    }
  };

  const categorizedProducts = useMemo(() => {
    const map = new Map<string, any[]>();
    map.set('All', []);
    
    products.forEach(p => {
      const cat = categorizeProduct(p.keywords);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
      map.get('All')!.push(p);
    });
    return map;
  }, [products]);

  const categories = Array.from(categorizedProducts.keys());

  const filteredProducts = useMemo(() => {
    let list = categorizedProducts.get(activeCategory) || [];
    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [categorizedProducts, activeCategory, searchQuery]);

  if (!user) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((msg, i) => (
          <div key={i} className="bg-zinc-800 border border-indigo-500/30 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 fade-in duration-300">
            <Bell size={18} className="text-indigo-400" />
            <span className="text-sm font-medium">{msg}</span>
          </div>
        ))}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">DigiHub</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900/50 border border-white/10 px-4 py-1.5 rounded-full">
              <Wallet size={16} className="text-emerald-400" />
              <span className="font-bold text-white">{new Intl.NumberFormat('vi-VN').format(user.balance)} đ</span>
            </div>
            
            <button 
              onClick={() => setShowRecharge(true)}
              className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full font-medium text-sm transition-colors"
            >
              Nạp Tiền
            </button>

            <button onClick={onSwitchToAdmin} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/30 rounded-lg px-2 py-1 bg-indigo-500/10">
              Admin Panel
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            
            <button onClick={onLogout} className="text-zinc-400 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <button 
              onClick={() => setView('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${view === 'home' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
            >
              <LayoutGrid size={20} />
              Cửa Hàng
            </button>
            <button 
              onClick={() => setView('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${view === 'history' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
            >
              <History size={20} />
              Lịch Sử Mua
            </button>
          </div>

          {view === 'home' && (
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Danh mục</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
                  >
                    {cat}
                    <span className="float-right text-xs text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded-full">
                      {categorizedProducts.get(cat)?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {view === 'home' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {activeCategory === 'All' ? 'Tất cả sản phẩm' : activeCategory}
                </h1>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
                  <p className="text-zinc-500">Không tìm thấy sản phẩm nào.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onBuy={handleBuy} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-3xl font-bold text-white tracking-tight">Lịch sử mua hàng</h1>
              <OrderHistory userId={user.id} />
            </div>
          )}
        </main>
      </div>

      {showRecharge && <RechargeModal userId={user.id} onClose={() => setShowRecharge(false)} />}
    </div>
  );
}

