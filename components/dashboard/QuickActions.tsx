export default function QuickActions() {
  const actions = [
    { icon: '🛒', label: 'Jual Hasil', color: 'bg-blue-100 text-blue-600' },
    { icon: '📊', label: 'Harga Pasar', color: 'bg-green-100 text-green-600' },
    { icon: '🌧️', label: 'Curah Hujan', color: 'bg-purple-100 text-purple-600' },
    { icon: '📝', label: 'Catatan', color: 'bg-orange-100 text-orange-600' },
    { icon: '💰', label: 'Pinjaman', color: 'bg-red-100 text-red-600' },
    { icon: '🛡️', label: 'Asuransi', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="mb-6">
      <h3 className="font-bold text-gray-700 mb-3">Aksi Cepat</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex flex-col items-center p-3 rounded-xl border border-gray-100 shadow-sm ${action.color} hover:shadow-md transition`}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-xs font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}