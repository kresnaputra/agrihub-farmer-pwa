'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { ArrowLeft, ShoppingCart, Clock, CheckCircle, XCircle, Truck, Search, Filter } from 'lucide-react';

interface Order {
  id: string;
  product_id: string;
  product_name: string;
  buyer_name: string;
  buyer_phone: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { supabase, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      fetchOrders();
    }
  }, [authLoading, user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          products:name(product_id)
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      // Format data
      const formattedOrders = data?.map((order: any) => ({
        ...order,
        product_name: order.products?.name || 'Produk tidak ditemukan'
      })) || [];
      
      setOrders(formattedOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Gagal memuat pesanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Gagal update status pesanan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-black';
      case 'processing': return 'bg-blue-100 text-black';
      case 'completed': return 'bg-green-100 text-black';
      case 'cancelled': return 'bg-red-100 text-black';
      default: return 'bg-gray-100 text-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Truck size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-black">Memuat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Pesanan</h1>
            {pendingCount > 0 && (
              <p className="text-sm text-white/80">{pendingCount} menunggu konfirmasi</p>
            )}
          </div>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesanan..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-white text-black placeholder:text-white/70"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border-2 border-white bg-white text-black text-sm"
          >
            <option value="all">Semua</option>
            <option value="pending">Menunggu</option>
            <option value="processing">Diproses</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Order List */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-black text-lg mb-2">Belum ada pesanan</p>
            <p className="text-gray-500">Pesanan dari pembeli akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                {/* Order Details */}
                <div className="mb-3">
                  <h3 className="font-semibold text-black">{order.product_name}</h3>
                  <p className="text-sm text-gray-600">
                    {order.quantity} item × Rp {Math.round(order.total_price / order.quantity).toLocaleString('id-ID')}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    Total: Rp {order.total_price.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Buyer Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-black font-medium">{order.buyer_name}</p>
                  {order.buyer_phone && (
                    <p className="text-sm text-gray-600">{order.buyer_phone}</p>
                  )}
                  {order.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">"{order.notes}"</p>
                  )}
                </div>

                {/* Action Buttons */}
                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                    >
                      Tolak
                    </button>
                  </div>
                )}

                {order.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}