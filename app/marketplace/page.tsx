'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Minus, Download, Bell, Share2, Info, RefreshCw } from 'lucide-react';

interface Commodity {
  id: number;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  market: string;
  lastUpdated: string;
  high: number;
  low: number;
  volume: number;
}

export default function MarketplacePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'rising' | 'falling'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [commodities, setCommodities] = useState<Commodity[]>([
    { id: 1, name: 'Bawang Merah', currentPrice: 25000, change: 1200, changePercent: 5.0, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '10:30', high: 26000, low: 24000, volume: 12000 },
    { id: 2, name: 'Cabai Rawit', currentPrice: 45000, change: -900, changePercent: -2.0, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '10:15', high: 47000, low: 42000, volume: 8000 },
    { id: 3, name: 'Padi', currentPrice: 8500, change: 85, changePercent: 1.0, unit: 'kg', market: 'Bulog', lastUpdated: '09:45', high: 8700, low: 8300, volume: 50000 },
    { id: 4, name: 'Kedelai', currentPrice: 12000, change: 360, changePercent: 3.0, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '11:00', high: 12500, low: 11500, volume: 15000 },
    { id: 5, name: 'Jagung', currentPrice: 7200, change: 0, changePercent: 0, unit: 'kg', market: 'Bulog', lastUpdated: '10:00', high: 7300, low: 7100, volume: 30000 },
    { id: 6, name: 'Bawang Putih', currentPrice: 32000, change: 1600, changePercent: 5.3, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '11:15', high: 33000, low: 31000, volume: 7000 },
    { id: 7, name: 'Cabai Merah', currentPrice: 38000, change: -760, changePercent: -2.0, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '10:45', high: 40000, low: 37000, volume: 6000 },
    { id: 8, name: 'Beras Premium', currentPrice: 12500, change: 375, changePercent: 3.1, unit: 'kg', market: 'Bulog', lastUpdated: '09:30', high: 12800, low: 12200, volume: 40000 },
    { id: 9, name: 'Kacang Tanah', currentPrice: 18000, change: 540, changePercent: 3.1, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '11:30', high: 18500, low: 17500, volume: 9000 },
    { id: 10, name: 'Tomat', currentPrice: 8000, change: -240, changePercent: -2.9, unit: 'kg', market: 'Pasar Induk Cipinang', lastUpdated: '10:20', high: 8500, low: 7800, volume: 12000 },
  ]);

  const [favorites, setFavorites] = useState<number[]>([1, 3, 4]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredCommodities = commodities
    .filter(commodity => 
      commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commodity.market.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(commodity => {
      if (filter === 'rising') return commodity.change > 0;
      if (filter === 'falling') return commodity.change < 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.currentPrice - a.currentPrice;
      if (sortBy === 'change') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
      return 0;
    });

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
              <h1 className="font-semibold text-black">Harga Pasar</h1>
              <p className="text-xs text-gray-600">Update real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-white mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="font-bold text-lg">Pasar Induk Cipinang</h2>
              <p className="text-sm opacity-90">Update terakhir: 25 Feb 2026, 11:30 WIB</p>
            </div>
            <Info size={18} className="opacity-80" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-xs opacity-90">Komoditas Naik</p>
              <p className="font-bold text-lg">6</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-90">Komoditas Turun</p>
              <p className="font-bold text-lg">3</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-90">Stabil</p>
              <p className="font-bold text-lg">1</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komoditas atau pasar..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('rising')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'rising' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
            >
              <TrendingUp size={12} className="inline mr-1" />
              Naik
            </button>
            <button
              onClick={() => setFilter('falling')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === 'falling' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}
            >
              <TrendingDown size={12} className="inline mr-1" />
              Turun
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="ml-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="name">Sortir: Nama</option>
              <option value="price">Sortir: Harga Tertinggi</option>
              <option value="change">Sortir: Perubahan Terbesar</option>
            </select>
          </div>
        </div>

        {/* Commodities List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-medium">Komoditas</th>
                  <th className="text-left p-3 font-medium">Harga</th>
                  <th className="text-left p-3 font-medium">Perubahan</th>
                  <th className="text-left p-3 font-medium">Pasar</th>
                  <th className="text-left p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommodities.map((commodity) => (
                  <tr key={commodity.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleFavorite(commodity.id)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          {favorites.includes(commodity.id) ? '★' : '☆'}
                        </button>
                        <div>
                          <h4 className="font-medium">{commodity.name}</h4>
                          <p className="text-xs text-gray-600">{commodity.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold">Rp {commodity.currentPrice.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">
                        {commodity.low.toLocaleString()} - {commodity.high.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center gap-1 font-medium ${commodity.change > 0 ? 'text-green-600' : commodity.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {commodity.change > 0 ? <TrendingUp size={12} /> : 
                         commodity.change < 0 ? <TrendingDown size={12} /> : 
                         <Minus size={12} />}
                        <span>Rp {Math.abs(commodity.change).toLocaleString()}</span>
                        <span>({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent}%)</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {commodity.lastUpdated}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{commodity.market}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCommodity(commodity)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Detail
                        </button>
                        <button className="text-gray-600 hover:text-black text-sm">
                          <Share2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCommodities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ditemukan komoditas yang sesuai
            </div>
          )}
        </div>

        {/* Selected Commodity Detail */}
        {selectedCommodity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{selectedCommodity.name}</h3>
                <button
                  onClick={() => setSelectedCommodity(null)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Harga Saat Ini</p>
                  <p className="font-bold text-2xl">Rp {selectedCommodity.currentPrice.toLocaleString()}/{selectedCommodity.unit}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Perubahan</p>
                    <p className={`font-medium ${selectedCommodity.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedCommodity.change > 0 ? '+' : ''}Rp {Math.abs(selectedCommodity.change).toLocaleString()} ({selectedCommodity.changePercent}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Volume</p>
                    <p className="font-medium">{selectedCommodity.volume.toLocaleString()} {selectedCommodity.unit}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tertinggi</p>
                    <p className="font-medium">Rp {selectedCommodity.high.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Terendah</p>
                    <p className="font-medium">Rp {selectedCommodity.low.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Pasar</p>
                  <p className="font-medium">{selectedCommodity.market}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Update Terakhir</p>
                  <p className="font-medium">{selectedCommodity.lastUpdated}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  Set Harga Jual
                </button>
                <button className="flex-1 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50">
                  Tambah Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Info size={16} />
            Informasi Penting
          </h4>
          <p className="text-sm text-blue-700">
            Harga pasar diupdate setiap 30 menit dari Pasar Induk Cipinang dan Bulog. 
            Harga dapat berbeda di pasar lokal tergantung kualitas dan lokasi.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={16} />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Bell size={16} />
            Set Price Alert
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 size={16} />
            Bagikan
          </button>
        </div>
      </main>
    </div>
  );
}