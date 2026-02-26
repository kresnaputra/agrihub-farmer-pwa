'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MapPin, Phone, Package, ArrowLeft, Plus, Minus } from 'lucide-react';
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
  
  const { supabase, user } = useAuth();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-black">Memuat produk...</p>
      </div>
    );
  }

  // Order Modal
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="p-2 -ml-2"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Pesan Produk</h1>
          </div>
        </div>

        {orderSuccess ? (
          <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Pesanan Berhasil!</h2>
            <p className="text-black text-center">
              Pesanan Anda telah dikirim ke petani.<br />
              Tunggu konfirmasi dari penjual.
            </p>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="p-4 space-y-4">
            {/* Product Info */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-semibold text-black text-lg">{selectedProduct.name}</h2>
              <p className="text-green-600 font-bold text-xl">
                Rp {selectedProduct.price.toLocaleString('id-ID')}/{selectedProduct.unit}
              </p>
              <p className="text-black text-sm mt-1">
                Stok tersedia: {selectedProduct.stock} {selectedProduct.unit}
              </p>
              {selectedProduct.seller && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-black font-medium">{selectedProduct.seller.name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    {selectedProduct.seller.village}, {selectedProduct.seller.city}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="bg-white rounded-lg p-4">
              <label className="block text-sm font-medium text-black mb-3">
                Jumlah Pesanan
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  <Minus size={20} className="text-black" />
                </button>
                <span className="text-xl font-bold text-black w-16 text-center">
                  {orderQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setOrderQuantity(Math.min(selectedProduct.stock, orderQuantity + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  <Plus size={20} className="text-black" />
                </button>
                <span className="text-black">{selectedProduct.unit}</span>
              </div>
              <p className="text-right text-lg font-bold text-green-600 mt-3">
                Total: Rp {(selectedProduct.price * orderQuantity).toLocaleString('id-ID')}
              </p>
            </div>

            {/* Buyer Info */}
            <div className="bg-white rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-black">Data Pembeli</h3>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Catatan (opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan untuk penjual..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !buyerName || !buyerPhone}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'Pesan Sekarang'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Product List
  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Marketplace</h1>
            <p className="text-sm text-white/80">Beli langsung dari petani</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau petani..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-white text-black placeholder:text-white/70"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-black text-lg">Tidak ada produk</p>
            <p className="text-gray-500">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="text-gray-300" size={48} />
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-black text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-green-600 font-bold mt-1">
                    Rp {product.price.toLocaleString('id-ID')}
                    <span className="text-xs text-gray-500 font-normal">/{product.unit}</span>
                  </p>
                  {product.seller && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={12} />
                      {product.seller.village || product.seller.city}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Stok: {product.stock} {product.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}