"use client";

import { useEffect, useState } from 'react';
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
  Download
} from 'lucide-react';

export default function FarmerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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

  const stats = [
    { label: 'Produk Aktif', value: '12', icon: Package, color: 'bg-blue-500' },
    { label: 'Pesanan Baru', value: '3', icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Pendapatan Hari Ini', value: 'Rp 450.000', icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Rating', value: '4.8', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Jual Produk', href: '/sell', icon: Package },
    { label: 'Lihat Pasar', href: '/market', icon: TrendingUp },
    { label: 'Pesanan Saya', href: '/orders', icon: ShoppingCart },
    { label: 'Pemberitahuan', href: '/notifications', icon: Bell },
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
                <span className="text-green-600 font-bold">A</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">AgriHub Petani</h1>
                <div className="flex items-center gap-1 text-xs">
                  {isOnline ? (
                    <>
                      <Cloud size={12} className="text-green-500" />
                      <span className="text-green-600">Online</span>
                    </>
                  ) : (
                    <>
                      <CloudOff size={12} className="text-gray-500" />
                      <span className="text-gray-600">Offline (mode lokal)</span>
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
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <User size={20} />
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
                  <p className="text-sm text-gray-500">{stat.label}</p>
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
          <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <action.icon size={24} className="text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity & Market Prices */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
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
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                    <p className="text-sm font-semibold text-green-700 mt-1">{activity.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
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
                    <p className="text-sm text-gray-500">{item.price}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.change.startsWith('+') ? 'bg-green-100 text-green-800' : item.change.startsWith('-') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
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

        {/* Offline Notice */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CloudOff size={20} className="text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Mode Offline</h3>
                <p className="text-sm text-yellow-700">
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
          <a
            key={action.label}
            href={action.href}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600"
          >
            <action.icon size={20} />
            <span className="text-xs mt-1">{action.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
