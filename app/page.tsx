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
  
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  const { user, logout, isLoading, supabase } = useAuth();
  const router = useRouter();

  // ALL useEffect hooks
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Fetch products from Supabase
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch orders from Supabase
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products:name(product_id)
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map((order: any) => ({
        ...order,
        product: order.products?.name || 'Produk tidak ditemukan',
        qty: order.quantity,
        total: order.total_price,
        buyer: order.buyer_name,
        date: new Date(order.created_at).toISOString().split('T')[0]
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

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
  const today = new Date().toISOString().split('T')[0];
  const todayIncome = orders
    .filter(o => o.date === today && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Produk Aktif', value: isLoadingProducts ? '...' : activeProducts.toString(), icon: Package, color: 'bg-blue-500' },
    { label: 'Pesanan Baru', value: isLoadingOrders ? '...' : pendingOrders.toString(), icon: ShoppingCart, color: 'bg-green-500' },
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
                  <p className="text-2xl font-bold mt-1 text-black">{stat.value}</p>
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
                <action.icon size={24} className="text-black mb-2" />
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
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'overview' ? 'text-black border-b-2 border-green-600' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'products' ? 'text-black border-b-2 border-green-600' : ''}`}
            >
              Produk ({activeProducts})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 text-center font-medium text-black ${activeTab === 'orders' ? 'text-black border-b-2 border-green-600' : ''}`}
            >
              Pesanan ({pendingOrders})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Marketplace Promo */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">Marketplace</h3>
                  <p className="text-sm text-white/90 mb-3">Beli dan jual produk pertanian langsung dari petani</p>
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Lihat Produk →
                  </button>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Aktivitas Terbaru</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <ShoppingCart size={16} className="text-black" />
                          </div>
                          <div>
                            <p className="font-medium text-black">{order.product}</p>
                            <p className="text-sm text-black">{order.buyer} • {order.date}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-black' :
                          order.status === 'processing' ? 'bg-blue-100 text-black' :
                          'bg-yellow-100 text-black'
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
                      className="text-sm text-black font-medium hover:underline"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-black">Bawang Merah</p>
                      <p className="font-bold text-black">Rp 25,000/kg</p>
                      <p className="text-xs text-black">+5% dari kemarin</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-black">Cabai Rawit</p>
                      <p className="font-bold text-black">Rp 45,000/kg</p>
                      <p className="text-xs text-black">-2% dari kemarin</p>
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
                    onClick={() => router.push('/products/add')}
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

                {isLoadingProducts ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-black mt-2">Memuat produk...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package size={24} className="text-black" />
                          </div>
                          <div>
                            <h4 className="font-medium text-black">{product.name}</h4>
                            <p className="text-sm text-black">Stok: {product.stock} {product.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-black">Rp {product.price.toLocaleString()}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-black' : 'bg-gray-100 text-black'}`}>
                            {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoadingProducts && products.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada produk. Tambah produk pertama Anda!
                  </div>
                )}
                <button
                  onClick={() => router.push('/products')}
                  className="w-full py-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                >
                  Kelola Produk Lengkap →
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-black">Daftar Pesanan</h3>
                </div>
                
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-black mt-2">Memuat pesanan...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-black">{order.product}</h4>
                            <p className="text-sm text-black">ID: {order.id} • Pembeli: {order.buyer}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-black' :
                            order.status === 'processing' ? 'bg-blue-100 text-black' :
                            'bg-yellow-100 text-black'
                          }`}>
                            {order.status === 'completed' ? 'Selesai' :
                             order.status === 'processing' ? 'Diproses' : 'Pending'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-sm text-black">Jumlah</p>
                            <p className="font-medium text-black">{order.qty} item</p>
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
                      </div>
                    ))}
                  </div>
                )}

                {!isLoadingOrders && orders.length === 0 && (
                  <div className="text-center py-8 text-black">
                    Belum ada pesanan.
                  </div>
                )}
                
                {!isLoadingOrders && orders.length > 0 && (
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full py-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                  >
                    Kelola Pesanan Lengkap →
                  </button>
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
            <Package size={20} className="text-black" />
            <span className="text-xs text-black mt-1">Jual Produk</span>
          </button>
          <button onClick={() => router.push('/marketplace')} className="flex flex-col items-center p-2">
            <TrendingUp size={20} className="text-black" />
            <span className="text-xs text-black mt-1">Lihat Pasar</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className="flex flex-col items-center p-2">
            <ShoppingCart size={20} className="text-black" />
            <span className="text-xs text-black mt-1">Pesanan Saya</span>
          </button>
          <button onClick={() => router.push('/notifications')} className="flex flex-col items-center p-2">
            <Bell size={20} className="text-black" />
            <span className="text-xs text-black mt-1">Pemberitahuan</span>
          </button>
        </div>
      </nav>
    </div>
  );
}