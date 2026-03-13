import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Calendar, Shield, MoreVertical, Edit, Trash2, X, Check } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  balance: number;
  role: string;
  created_at: string;
}

export const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editBalance, setEditBalance] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(data.message || 'Lỗi khi xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Lỗi kết nối đến máy chủ');
    }
  };

  const startEdit = (user: UserData) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditBalance(user.balance || 0);
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editRole, balance: editBalance })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: editRole, balance: editBalance } : u));
        setEditingUser(null);
      } else {
        alert(data.message || 'Lỗi khi cập nhật người dùng');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Lỗi kết nối đến máy chủ');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Quản lý Người dùng</h2>
          <p className="text-sm text-zinc-400 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-800/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Số dư</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-medium border border-indigo-500/20">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="font-medium text-zinc-200">{user.username || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-zinc-500" />
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {editingUser?.id === user.id ? (
                        <input
                          type="number"
                          value={editBalance}
                          onChange={(e) => setEditBalance(Number(e.target.value))}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      ) : (
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.balance || 0)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-zinc-900/50 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                          <option value="user">Thành viên</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'admin' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-zinc-800 text-zinc-300 border-white/5'
                        }`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                          {user.role === 'admin' ? 'Admin' : 'Thành viên'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-zinc-500" />
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUser?.id === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={saveEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                            <Check size={16} />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 text-zinc-400 hover:bg-zinc-400/10 rounded-lg transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(user)} className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
