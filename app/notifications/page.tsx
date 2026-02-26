'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  X, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare,
  Filter,
  CheckCircle,
  Settings,
  Trash2,
  Clock
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'order' | 'payment' | 'product' | 'price' | 'system' | 'message';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  isImportant: boolean;
  action?: string;
  data?: any;
}

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'order', title: 'Pesanan Baru', message: 'PT Sumber Jaya memesan 5kg Bawang Merah', time: '10:30', isRead: false, isImportant: true, action: 'lihat', data: { orderId: 'ORD-001' } },
    { id: 2, type: 'payment', title: 'Pembayaran Diterima', message: 'Rp 125.000 untuk pesanan ORD-001 telah diterima', time: '09:45', isRead: true, isImportant: true, action: 'konfirmasi' },
    { id: 3, type: 'price', title: 'Harga Naik', message: 'Harga Cabai Rawit naik 5% di Pasar Induk Cipinang', time: '08:15', isRead: false, isImportant: false, action: 'lihat' },
    { id: 4, type: 'product', title: 'Stok Menipis', message: 'Stok Bawang Merah tersisa 10kg', time: 'Kemarin', isRead: true, isImportant: false, action: 'tambah' },
    { id: 5, type: 'system', title: 'Pemeliharaan Sistem', message: 'Akan ada pemeliharaan sistem hari Sabtu pukul 00:00-03:00', time: 'Kemarin', isRead: true, isImportant: false },
    { id: 6, type: 'message', title: 'Pesan dari Pembeli', message: 'Bu Ani: "Bisa kirim hari ini?"', time: '2 hari lalu', isRead: false, isImportant: false, action: 'balas' },
    { id: 7, type: 'order', title: 'Pesanan Diproses', message: 'Pesanan ORD-002 untuk Warung Bu Ani sedang diproses', time: '3 hari lalu', isRead: true, isImportant: false },
    { id: 8, type: 'payment', title: 'Pembayaran Tertunda', message: 'Pembayaran Rp 85.000 untuk Cabai Rawit tertunda', time: '3 hari lalu', isRead: true, isImportant: true, action: 'periksa' },
    { id: 9, type: 'price', title: 'Alert Harga', message: 'Harga Padi mencapai Rp 8.500/kg', time: '4 hari lalu', isRead: true, isImportant: false },
    { id: 10, type: 'system', title: 'Update Aplikasi', message: 'Versi terbaru aplikasi AgriHub tersedia', time: '1 minggu lalu', isRead: true, isImportant: false, action: 'update' },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    if (confirm('Hapus semua notifikasi?')) {
      setNotifications([]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart size={16} className="text-black" />;
      case 'payment': return <DollarSign size={16} className="text-black" />;
      case 'product': return <Package size={16} className="text-purple-600" />;
      case 'price': return <TrendingUp size={16} className="text-yellow-600" />;
      case 'system': return <AlertTriangle size={16} className="text-black" />;
      case 'message': return <MessageSquare size={16} className="text-pink-600" />;
      default: return <Bell size={16} className="text-black" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Pesanan';
      case 'payment': return 'Pembayaran';
      case 'product': return 'Produk';
      case 'price': return 'Harga';
      case 'system': return 'Sistem';
      case 'message': return 'Pesan';
      default: return 'Umum';
    }
  };

  const filteredNotifications = notifications
    .filter(notif => {
      if (filter === 'unread') return !notif.isRead;
      if (filter === 'important') return notif.isImportant;
      return true;
    })
    .filter(notif => {
      if (selectedType === 'all') return true;
      return notif.type === selectedType;
    });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-black">Notifikasi</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-black">{notifications.length} notifikasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Settings size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b p-4">
          <h3 className="font-medium mb-2">Pengaturan Notifikasi</h3>
          <div className="space-y-2">
            <button
              onClick={markAllAsRead}
              className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Tandai semua sudah dibaca
            </button>
            <button
              onClick={clearAll}
              className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2 text-black"
            >
              <Trash2 size={16} />
              Hapus semua notifikasi
            </button>
          </div>
        </div>
      )}

      <main className="p-4 max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-sm text-black">Total</p>
            <p className="font-bold text-lg">{notifications.length}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-sm text-black">Belum Dibaca</p>
            <p className="font-bold text-lg text-black">{unreadCount}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-sm text-black">Penting</p>
            <p className="font-bold text-lg text-yellow-600">{importantCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-green-100 text-black' : 'bg-gray-100 text-black'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'unread' ? 'bg-blue-100 text-black' : 'bg-gray-100 text-black'}`}
            >
              Belum Dibaca
            </button>
            <button
              onClick={() => setFilter('important')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'important' ? 'bg-yellow-100 text-black' : 'bg-gray-100 text-black'}`}
            >
              Penting
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedType === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
            >
              Semua Tipe
            </button>
            {['order', 'payment', 'product', 'price', 'system', 'message'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedType === type ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} flex items-center gap-1`}
              >
                {getTypeIcon(type)}
                {getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="text-black mx-auto mb-4" />
              <h3 className="font-medium text-black mb-2">Tidak ada notifikasi</h3>
              <p className="text-black text-sm">Semua notifikasi sudah dibaca</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          {notification.isImportant && (
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-black rounded-full">
                              Penting
                            </span>
                          )}
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-black">
                          <Clock size={10} />
                          {notification.time}
                        </div>
                      </div>
                      
                      <p className="text-sm text-black mb-3">{notification.message}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-black hover:text-black flex items-center gap-1"
                            >
                              <Check size={12} />
                              Tandai dibaca
                            </button>
                          )}
                          {notification.action && (
                            <button className="text-xs text-black hover:text-black">
                              {notification.action.charAt(0).toUpperCase() + notification.action.slice(1)} →
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-black hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Types Info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium mb-3">Jenis Notifikasi</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-black" />
              <span className="text-sm">Pesanan</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-black" />
              <span className="text-sm">Pembayaran</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={14} className="text-purple-600" />
              <span className="text-sm">Produk</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-600" />
              <span className="text-sm">Harga</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-black" />
              <span className="text-sm">Sistem</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-pink-600" />
              <span className="text-sm">Pesan</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-medium text-black mb-2">Tips</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Notifikasi penting akan tetap muncul di atas</li>
            <li>• Aktifkan push notification di pengaturan</li>
            <li>• Setel alert harga untuk komoditas favorit</li>
            <li>• Notifikasi pesanan harus segera ditanggapi</li>
          </ul>
        </div>
      </main>
    </div>
  );
}