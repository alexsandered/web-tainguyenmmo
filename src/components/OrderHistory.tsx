import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Copy, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Order {
  id: number;
  product_name: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  delivered_data: string | null;
}

export const OrderHistory: React.FC<{ userId: number }> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5s for updates
    return () => clearInterval(interval);
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã copy!');
  };

  const downloadFile = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <div className="text-center py-10 text-zinc-400">Đang tải lịch sử...</div>;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">Chưa có đơn hàng nào.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-zinc-200">{order.product_name}</h4>
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span>Mã ĐH: #{order.id}</span>
                <span>•</span>
                <span>{new Date(order.created_at).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {order.status === 'Pending' && (
                <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <Clock size={16} className="animate-spin-slow" />
                  Đang xử lý (1-5p)
                </div>
              )}
              
              {order.status === 'Completed' && (
                <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                    <CheckCircle size={16} />
                    Hoàn thành
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(order.delivered_data || '')}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                      title="Copy tài khoản"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => downloadFile(order.delivered_data || '', `order_${order.id}.txt`)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                      title="Tải file .txt"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              )}

              {order.status.startsWith('Failed') && (
                <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                  <AlertCircle size={16} />
                  Thất bại
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
