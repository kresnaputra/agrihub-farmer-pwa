"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp,
  Bell,
  User,
  Menu,
  LogOut,
  Cloud,
  CloudOff,
  Download,
  Plus,
  ChevronRight
} from 'lucide-react';

export default function FarmerDashboard() {
  // ALL HOOKS MUST BE FIRST - before any early returns
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', unit: 'kg' });
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Bawang Merah', price: 25000, stock: 50, unit: 'kg', status: 'active', image: null },
    { id: 2, name: 'Cabai Rawit', price: 45000, stock: 30, unit: 'kg', status: 'active', image: null },
    { id: 3, name: 'Padi', price: 8500, stock: 100, unit: 'kg', status: 'active', image: null },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-001', product: 'Bawang Merah', qty: 5, total: 125000, status: 'pending', buyer: 'PT Sumber Jaya', date: '2026-02-25' },
    { id: 'ORD-002', product: 'Cabai Rawit', qty: 2, total: 90000, status: 'processing', buyer: 'Warung Bu Ani', date: '2026-02-25' },
    { id: 'ORD-003', product: 'Padi', qty: 100, total: 850000, status: 'completed', buyer: 'Penggilingan XYZ', date: '2026-02-24' },
  ]);
  
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // ALL useEffect hooks
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // NOW safe to have early returns
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const activeProducts = products.filter(p => p.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const todayIncome = orders
    .filter(o => o.date === '2026-02-25' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Produk Aktif', value: activeProducts.toString(), icon: Package, color: 'bg-blue-500' },
    { label: 'Pesanan Baru', value: pendingOrders.toString(), icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Pendapatan Hari Ini', value: `Rp ${todayIncome.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Rating', value: '4.8', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      stock: parseInt(newProduct.stock),
      unit: newProduct.unit,
      status: 'active',
      image: null
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', stock: '', unit: 'kg' });
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Hapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const quickActions = activeTab === 'overview' ? [
    { label: 'Jual Produk', onClick: () => setActiveTab('products'), icon: Package },
    { label: 'Lihat Pasar', onClick: () => router.push('/marketplace'), icon: TrendingUp },
    { label: 'Pesanan Saya', onClick: () => setActiveTab('orders'), icon: ShoppingCart },
    { label: 'Pemberitahuan', onClick: () => router.push('/notifications'), icon: Bell },
  ] : activeTab === 'products' ? [
    { label: 'Tambah Produk', onClick: () => setShowAddProduct(true), icon: Plus },
    { label: 'Refresh', onClick: () => {}, icon: TrendingUp },
    { label: 'Export Data', onClick: () => {}, icon: Download },
    { label: 'Bantuan', onClick: () => {}, icon: Bell },
  ] : [
    { label: 'Pesanan Baru', onClick: () => {}, icon: ShoppingCart },
    { label: 'Refresh', onClick: () => {}, icon: TrendingUp },
    { label: 'Export Data', onClick: () => {}, icon: Download },
    { label: 'Bantuan', onClick: () => {}, icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-black">AgriHub Petani</h1>
              <p className="text-xs text-black flex items-center gap-1">
                {isOnline ? (
                  <><Cloud size={12} className="text-green-500" /> Online</>
                ) : (
                  <><CloudOff size={12} className="text-red-500" /> Offline</>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isInstallable && (
              <button 
                onClick={handleInstall}
                className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                <Download size={16} />
                Install App
              </button>
            )}
            <button 
              onClick={() => router.push('/profile')}
              className="hidden md:flex items-center gap-2 px-3 py-1 border-r border-gray-200 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-black text-xs font-bold">{user.name.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-black">{user.name.split(' ')[0]}</span>
            </button>
            <button 
              onClick={() => router.push('/notifications')}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <action.icon size={24} className="text-green-600 mb-2" />
                <span className="text-sm font-medium text-center text-black">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : ''}`}
            >
              Produk ({activeProducts})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'orders' ? 'text-green-600 border-b-2 border-green-600' : ''}`}
            >
              Pesanan ({pendingOrders})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Recent Activity */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Aktivitas Terbaru</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ShoppingCart size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{order.product}</p>
                            <p className="text-sm text-black">{order.buyer} • {order.date}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'completed' ? 'Selesai' :
                           order.status === 'processing' ? 'Diproses' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Prices */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-black">Harga Pasar Hari Ini</h3>
                    <button 
                      onClick={() => router.push('/marketplace')}
                      className="text-sm text-green-600 font-medium hover:underline"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-black">Bawang Merah</p>
                      <p className="font-bold text-black">Rp 25,000/kg</p>
                      <p className="text-xs text-green-600">+5% dari kemarin</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-black">Cabai Rawit</p>
                      <p className="font-bold text-black">Rp 45,000/kg</p>
                      <p className="text-xs text-red-600">-2% dari kemarin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-black">Daftar Produk</h3>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    + Tambah Produk
                  </button>
                </div>

                {showAddProduct && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-black">Produk Baru</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Nama produk"
                        className="p-2 border rounded-lg text-black"
                      />
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="Harga"
                        className="p-2 border rounded-lg text-black"
                      />
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="Stok"
                        className="p-2 border rounded-lg text-black"
                      />
                      <select
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        className="p-2 border rounded-lg text-black"
                      >
                        <option value="kg">kg</option>
                        <option value="gram">gram</option>
                        <option value="unit">unit</option>
                        <option value="pack">pack</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddProduct}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setShowAddProduct(false)}
                        className="px-4 py-2 bg-gray-200 text-black rounded-lg text-sm font-medium hover:bg-gray-300"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">{product.name}</h4>
                          <p className="text-sm text-black">Stok: {product.stock} {product.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">Rp {product.price.toLocaleString()}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada produk. Tambah produk pertama Anda!
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-black">Daftar Pesanan</h3>
                
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-black">{order.product}</h4>
                          <p className="text-sm text-black">ID: {order.id} • Pembeli: {order.buyer}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'completed' ? 'Selesai' :
                           order.status === 'processing' ? 'Diproses' : 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-sm text-black">Jumlah</p>
                          <p className="font-medium text-black">{order.qty} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-black">Total</p>
                          <p className="font-medium text-black">Rp {order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-black">Tanggal</p>
                          <p className="font-medium text-black">{order.date}</p>
                        </div>
                      </div>
                      {order.status !== 'completed' && (
                        <div className="mt-3 flex gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                              className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Proses
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              className="px-3 py-1 rounded text-sm bg-green-600 text-white hover:bg-green-700"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada pesanan.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around py-2">
          <button onClick={() => setActiveTab('products')} className="flex flex-col items-center p-2">
            <Package size={20} className="text-green-600" />
            <span className="text-xs text-black mt-1">Jual Produk</span>
          </button>
          <button onClick={() => router.push('/marketplace')} className="flex flex-col items-center p-2">
            <TrendingUp size={20} className="text-green-600" />
            <span className="text-xs text-black mt-1">Lihat Pasar</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className="flex flex-col items-center p-2">
            <ShoppingCart size={20} className="text-green-600" />
            <span className="text-xs text-black mt-1">Pesanan Saya</span>
          </button>
          <button onClick={() => router.push('/notifications')} className="flex flex-col items-center p-2">
            <Bell size={20} className="text-green-600" />
            <span className="text-xs text-black mt-1">Pemberitahuan</span>
          </button>
        </div>
      </nav>
    </div>
  );
}