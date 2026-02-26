export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Pendapatan Bulan Ini</div>
          <span className="text-green-500">💰</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">Rp 4.2jt</div>
        <div className="text-green-500 text-xs mt-1 flex items-center">
          <span>📈</span>
          <span className="ml-1">Naik 15%</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Panen Mendatang</div>
          <span className="text-blue-500">📅</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">12 Hari</div>
        <div className="text-blue-500 text-xs mt-1">Padi IR64</div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Produk Aktif</div>
          <span className="text-purple-500">🌾</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">3</div>
        <div className="text-purple-500 text-xs mt-1">2 dalam negoisasi</div>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Rating</div>
          <span className="text-yellow-500">⭐</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">4.8</div>
        <div className="text-yellow-500 text-xs mt-1">24 review</div>
      </div>
    </div>
  );
}