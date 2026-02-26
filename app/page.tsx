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
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Check online status
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

  // PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Product management state
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

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', unit: 'kg' });

  // Calculate dynamic stats
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

  // Dynamic quick actions based on active tab
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
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <div>
                <h1 className="font-semibold text-black">AgriHub Petani</h1>
                <div className="flex items-center gap-1 text-xs">
                  {isOnline ? (
                    <>
                      <Cloud size={12} className="text-green-500" />
                      <span className="text-black font-medium">Online</span>
                    </>
                  ) : (
                    <>
                      <CloudOff size={12} className="text-black" />
                      <span className="text-black font-medium">Offline (mode lokal)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
                  <div className="space-y-3">
                    {[
                      { time: '10:30', product: 'Bawang Merah', action: 'Pesanan baru dari PT Sumber Jaya', amount: 'Rp 120.000' },
                      { time: '09:15', product: 'Cabai Rawit', action: 'Produk disetujui pembeli', amount: 'Rp 85.000' },
                      { time: 'Kemarin', product: 'Padi', action: 'Pembayaran diterima', amount: 'Rp 2.450.000' },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{activity.product}</h4>
                            <span className="text-sm text-black">{activity.time}</span>
                          </div>
                          <p className="text-sm text-black mt-1">{activity.action}</p>
                          <p className="text-sm font-semibold text-black mt-1">{activity.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Harga Pasar Hari Ini</h2>
                  <div className="space-y-3">
                    {[
                      { product: 'Bawang Merah', price: 'Rp 25.000/kg', change: '+5%' },
                      { product: 'Cabai Rawit', price: 'Rp 45.000/kg', change: '-2%' },
                      { product: 'Padi', price: 'Rp 8.500/kg', change: '+1%' },
                      { product: 'Kedelai', price: 'Rp 12.000/kg', change: '+3%' },
                      { product: 'Jagung', price: 'Rp 7.200/kg', change: '0%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium">{item.product}</h4>
                          <p className="text-sm text-black">{item.price}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.change.startsWith('+') ? 'bg-green-100 text-black' : item.change.startsWith('-') ? 'bg-red-100 text-black' : 'bg-gray-100 text-black'}`}>
                          {item.change}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-center text-green-600 font-medium border border-green-300 rounded-lg hover:bg-green-50">
                    Lihat Semua Harga
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Daftar Produk Anda</h2>
                  <button
                    onClick={() => setShowAddProduct(!showAddProduct)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus size={16} />
                    {showAddProduct ? 'Tutup Form' : 'Tambah Produk'}
                  </button>
                </div>

                {showAddProduct && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">Tambah Produk Baru</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nama Produk</label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Contoh: Bawang Merah"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Harga per Satuan (Rp)</label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="25000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Stok</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Satuan</label>
                        <select
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="kg">Kilogram (kg)</option>
                          <option value="g">Gram (g)</option>
                          <option value="buah">Buah</option>
                          <option value="ikat">Ikat</option>
                          <option value="karung">Karung</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setShowAddProduct(false)}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleAddProduct}
                        disabled={!newProduct.name || !newProduct.price || !newProduct.stock}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Simpan Produk
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-medium">Nama Produk</th>
                        <th className="text-left p-3 font-medium">Harga</th>
                        <th className="text-left p-3 font-medium">Stok</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-black">{product.unit}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">Rp {product.price.toLocaleString()}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">{product.stock}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'}`}>
                              {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada produk. Tambahkan produk pertama Anda!
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Daftar Pesanan</h2>
                  <div className="text-sm text-black">
                    Total: {orders.length} pesanan
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{order.product}</h3>
                          <p className="text-sm text-black">ID: {order.id} • Pembeli: {order.buyer}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-black'
                        }`}>
                          {order.status === 'pending' ? 'Menunggu' :
                           order.status === 'processing' ? 'Diproses' :
                           order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-black">Jumlah</p>
                          <p className="font-medium">{order.qty} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-black">Total</p>
                          <p className="font-medium">Rp {order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-black">Tanggal</p>
                          <p className="font-medium">{order.date}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-black">
                          Update status:
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className={`px-3 py-1 rounded text-sm ${order.status === 'pending' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-black'}`}
                            disabled={order.status !== 'pending'}
                          >
                            Proses
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                            className={`px-3 py-1 rounded text-sm ${order.status === 'processing' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-black'}`}
                            disabled={order.status !== 'processing'}
                          >
                            Selesai
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada pesanan. Produk Anda akan muncul di marketplace!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CloudOff size={20} className="text-yellow-600" />
              <div>
                <h3 className="font-semibold text-black">Mode Offline</h3>
                <p className="text-sm text-black">
                  Anda sedang offline. Data yang ditampilkan adalah versi terakhir yang disimpan. Beberapa fitur mungkin tidak tersedia.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around md:hidden">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="flex flex-col items-center p-2 text-black hover:text-green-600"
          >
            <action.icon size={20} />
            <span className="text-xs mt-1">{action.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
