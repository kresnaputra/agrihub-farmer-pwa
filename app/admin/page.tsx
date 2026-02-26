'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  DollarSign,
  ArrowLeft,
  LogOut,
  Shield
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalFarmers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { supabase, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkAdminAndFetchStats();
    }
  }, [user]);

  const checkAdminAndFetchStats = async () => {
    try {
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);

      // Fetch stats
      const [
        usersResult,
        farmersResult,
        buyersResult,
        productsResult,
        ordersResult,
        pendingResult,
        completedResult,
        revenueResult,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'farmer'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'buyer'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('orders').select('total_price').eq('status', 'completed'),
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalFarmers: farmersResult.count || 0,
        totalBuyers: buyersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        pendingOrders: pendingResult.count || 0,
        completedOrders: completedResult.count || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Petani', value: stats.totalFarmers, icon: Shield, color: 'bg-green-500' },
    { label: 'Pembeli', value: stats.totalBuyers, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Produk', value: stats.totalProducts, icon: Package, color: 'bg-orange-500' },
    { label: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-pink-500' },
    { label: 'Pendapatan', value: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

  const quickActions = [
    { label: 'Kelola Pengguna', icon: Users, path: '/admin/users', color: 'bg-blue-100 text-blue-700' },
    { label: 'Kelola Produk', icon: Package, path: '/admin/products', color: 'bg-orange-100 text-orange-700' },
    { label: 'Lihat Pesanan', icon: ShoppingCart, path: '/admin/orders', color: 'bg-pink-100 text-pink-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="text-green-600" size={28} />
              <div>
                <h1 className="font-bold text-gray-800">Admin Panel</h1>
                <p className="text-xs text-gray-500">AgriHub Management</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500">Selamat datang kembali, Admin!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.path)}
                className={`flex items-center gap-4 p-4 rounded-xl ${action.color} hover:opacity-90 transition-opacity`}
              >
                <action.icon size={24} />
                <span className="font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Pesanan Menunggu</h3>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                {stats.pendingOrders}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Pesanan yang menunggu konfirmasi dari petani
            </p>
            <button
              onClick={() => router.push('/admin/orders')}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Lihat Semua Pesanan
            </button>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Pesanan Selesai</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {stats.completedOrders}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Total transaksi yang berhasil diselesaikan
            </p>
            <button
              onClick={() => router.push('/admin/orders')}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}