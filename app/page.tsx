'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MapPin, Star, ArrowLeft, Plus, Minus, Store, Heart, ShoppingBag } from 'lucide-react';
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

const CATEGORIES = ['Semua', 'Sayuran', 'Buah', 'Beras', 'Umbi', 'Rempah', 'Lainnya'];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || 
      product.name.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate random discount for demo
  const getDiscount = (id: string) => {
    const discounts = [10, 15, 20, 25, 30];
    const index = id.charCodeAt(0) % discounts.length;
    return discounts[index];
  };

  // Generate random sold count for demo
  const getSoldCount = (id: string) => {
    const counts = ['100+', '250+', '500+', '1rb+', '5rb+'];
    const index = id.charCodeAt(id.length - 1) % counts.length;
    return counts[index];
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
    const discount = getDiscount(selectedProduct.id);
    const originalPrice = Math.round(selectedProduct.price * 100 / (100 - discount));

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 h-14 flex items-center gap-3">
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
              <ShoppingBag className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-600 text-center max-w-sm">
              Pesanan Anda telah dikirim ke petani. Tunggu konfirmasi dari penjual.
            </p>
          </div>
        ) : (
          <div>
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 relative">
              {selectedProduct.image_url ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="text-gray-300" size={80} />
                </div>
              )}
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                {discount}% OFF
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-gray-800 flex-1">{selectedProduct.name}</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Heart size={24} className="text-gray-400" />
                </button>
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-800">
                  {formatPrice(selectedProduct.price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              </div>
              <span className="text-sm text-rose-500 font-medium">/ {selectedProduct.unit}</span>

              {/* Rating & Sold */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">4.8</span>
                </div>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">Terjual {getSoldCount(selectedProduct.id)}</span>
              </div>
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
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{selectedProduct.seller.village}, {selectedProduct.seller.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-green-600 fill-green-600" />
                    <span className="text-sm font-medium text-green-700">4.9</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-gray-800">Produk</p>
                    <p className="text-xs text-gray-500">{selectedProduct.stock} unit</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-gray-800">Bergabung</p>
                    <p className="text-xs text-gray-500">2 tahun</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="text-sm font-bold text-gray-800">Rating</p>
                    <p className="text-xs text-gray-500">99% positif</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {selectedProduct.description && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>
            )}

            {/* Order Form */}
            <form onSubmit={handleOrder} className="p-4 space-y-4">
              {/* Quantity */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jumlah Pesanan
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors bg-white"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold text-gray-800 w-12 text-center">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQuantity(Math.min(selectedProduct.stock, orderQuantity + 1))}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors bg-white"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-gray-500 font-medium">{selectedProduct.unit}</span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Total & Submit */}
              <div className="bg-white border-t border-gray-100 pt-4 sticky bottom-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Harga</p>
                    <span className="text-2xl font-bold text-rose-600">
                      {formatPrice(selectedProduct.price * orderQuantity)}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !buyerName || !buyerPhone}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
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

  // Product List (Tokopedia Style)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        {/* Top Bar */}
        <div className="px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="font-bold text-green-600 text-lg hidden sm:block">AgriHub</span>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk pertanian..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          
          {/* Cart & Login */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart size={22} className="text-gray-600" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Masuk
            </button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="border-t border-gray-100 overflow-x-auto">
          <div className="flex gap-1 px-4 py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-sm font-medium">🚚 Gratis Ongkir</p>
          <p className="text-xs text-white/80">Untuk pembelian pertama di AgriHub</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 pb-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={40} />
            </div>
            <p className="text-gray-800 font-medium text-lg mb-1">Produk tidak ditemukan</p>
            <p className="text-gray-500 text-sm">Coba kata kunci atau kategori lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const discount = getDiscount(product.id);
              const originalPrice = Math.round(product.price * 100 / (100 - discount));
              
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
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
                        <ShoppingBag className="text-gray-300" size={48} />
                      </div>
                    )}
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {discount}%
                    </div>
                    {/* Wishlist Button */}
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
                      <Heart size={16} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="mt-1.5">
                      <p className="text-rose-600 font-bold">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </p>
                    </div>

                    {/* Rating & Sold */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                        <Star size={10} className="text-green-600 fill-green-600" />
                        <span className="text-xs font-medium text-green-700">4.8</span>
                      </div>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500">Terjual {getSoldCount(product.id)}</span>
                    </div>

                    {/* Location */}
                    {product.seller && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span className="truncate">{product.seller.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}