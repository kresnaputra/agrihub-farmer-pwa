'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MapPin, Star, ArrowLeft, Plus, Minus, Store, Package } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  image_url?: string;
  description?: string;
  user_id?: string;
  seller?: {
    name: string;
    phone: string;
    village: string;
    city: string;
  };
}

export default function BuyerPortal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const { supabase } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles(name, phone, village, city)
        `)
        .eq('status', 'active')
        .gt('stock', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      const totalPrice = selectedProduct.price * orderQuantity;

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            product_id: selectedProduct.id,
            seller_id: selectedProduct.user_id,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            quantity: orderQuantity,
            total_price: totalPrice,
            notes: notes,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      setOrderSuccess(true);
      setTimeout(() => {
        setSelectedProduct(null);
        setOrderSuccess(false);
        setBuyerName('');
        setBuyerPhone('');
        setNotes('');
        setOrderQuantity(1);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Gagal memesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Memuat produk...</p>
      </div>
    );
  }

  // Order Modal
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-4">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Detail Produk</h1>
          </div>
        </div>

        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-600 text-center max-w-sm">
              Pesanan Anda telah dikirim ke petani. Tunggu konfirmasi dari penjual.
            </p>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Product Image */}
            <div className="bg-white">
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ShoppingCart className="text-gray-300 mx-auto mb-2" size={64} />
                    <p className="text-gray-400">Tidak ada gambar</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <span className="text-gray-500">/ {selectedProduct.unit}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Stok tersedia: <span className="font-medium text-gray-700">{selectedProduct.stock} {selectedProduct.unit}</span>
                </p>
              </div>

              {/* Seller Info */}
              {selectedProduct.seller && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Store className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{selectedProduct.seller.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={14} />
                        {selectedProduct.seller.village}, {selectedProduct.seller.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedProduct.description && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrder} className="p-4 space-y-4">
              {/* Quantity */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jumlah Pesanan
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold text-gray-800 w-12 text-center">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.min(selectedProduct.stock, orderQuantity + 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-gray-500">{selectedProduct.unit}</span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-800">Data Pembeli</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tambahkan catatan untuk penjual..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total Harga</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(selectedProduct.price * orderQuantity)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !buyerName || !buyerPhone}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                >
                  {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}
                </button>
              </div>
            </form>

            {/* Spacer */}
            <div className="h-6"></div>
          </div>
        )}
      </div>
    );
  }

  // Product List
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center -ml-2">
            <ShoppingCart className="text-green-600" size={20} />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-gray-800">Marketplace</h1>
            <p className="text-xs text-gray-500">Beli langsung dari petani</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Login Petani
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-sm pb-3">
        <div className="max-w-lg mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau petani..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-lg mx-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={40} />
            </div>
            <p className="text-gray-800 font-medium text-lg mb-1">Produk tidak ditemukan</p>
            <p className="text-gray-500 text-sm">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-95"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="text-gray-300" size={48} />
                    </div>
                  )}
                  {/* Stock Badge */}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    Stok: {product.stock}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-green-600 font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-400 text-xs">/{product.unit}</span>
                  </div>
                  {product.seller && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <Store size={12} />
                      <span className="truncate">{product.seller.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Spacer */}
      <div className="h-6"></div>
    </div>
  );
}