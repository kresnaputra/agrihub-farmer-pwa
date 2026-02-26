export default function ProductListings() {
  const products = [
    {
      id: 1,
      name: 'Padi IR64',
      type: 'rice',
      quality: 'Premium',
      quantity: '500 kg',
      date: '25 Feb',
      price: 'Rp 8.500/kg',
      status: 'active',
      bidders: 3,
    },
    {
      id: 2,
      name: 'Jagung Manis',
      type: 'corn',
      quality: 'Grade A',
      quantity: '200 kg',
      date: '28 Feb',
      price: 'Rp 6.200/kg',
      status: 'pending',
      bidders: 0,
    },
    {
      id: 3,
      name: 'Cabe Rawit',
      type: 'vegetable',
      quality: 'Segar',
      quantity: '100 kg',
      date: '1 Mar',
      price: 'Rp 25.000/kg',
      status: 'sold',
      bidders: 5,
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      rice: 'bg-green-500',
      corn: 'bg-yellow-500',
      vegetable: 'bg-red-500',
      fruit: 'bg-purple-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      active: { text: 'Aktif', color: 'bg-green-100 text-green-800' },
      pending: { text: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
      sold: { text: 'Terjual', color: 'bg-blue-100 text-blue-800' },
    };
    return badges[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-700">Produk Saya</h3>
        <button className="text-green-600 text-sm font-medium flex items-center">
          <span className="mr-1">+</span> Tambah Produk
        </button>
      </div>
      
      <div className="space-y-3">
        {products.map((product) => {
          const statusBadge = getStatusBadge(product.status);
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 ${getTypeColor(
                      product.type
                    )} rounded-lg flex items-center justify-center text-white font-bold`}
                  >
                    {product.type === 'rice' && 'P'}
                    {product.type === 'corn' && 'J'}
                    {product.type === 'vegetable' && 'C'}
                    {product.type === 'fruit' && 'B'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                    <p className="text-gray-600 text-sm">{product.quality}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-3">⚖️ {product.quantity}</span>
                      <span>📅 {product.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{product.price}</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 ${statusBadge.color}`}>
                    {statusBadge.text}
                  </div>
                  {product.bidders > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {product.bidders} penawar
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}