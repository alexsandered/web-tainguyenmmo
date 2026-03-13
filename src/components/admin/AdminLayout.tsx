import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Bell, LogOut, Globe, LayoutGrid } from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchToUser: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, setActiveTab, onSwitchToUser, onLogout, children }) => {
  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Quản lý Sản phẩm', icon: <Package size={20} /> },
    { id: 'orders', label: 'Quản lý Đơn hàng', icon: <ShoppingCart size={20} /> },
    { id: 'users', label: 'Quản lý User', icon: <Users size={20} /> },
    { id: 'announcements', label: 'Cài đặt Thông báo', icon: <Bell size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex text-zinc-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">DigiAdmin</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-medium' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-zinc-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-white capitalize">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onSwitchToUser}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors border border-white/5"
            >
              <Globe size={16} />
              Trang User
            </button>
            
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-zinc-500">admin@digihub.vn</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-zinc-900 shadow-sm">
                A
              </div>
            </div>
            
            <button onClick={onLogout} className="text-zinc-400 hover:text-rose-400 transition-colors ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
