'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Plus, Package, Edit, Trash2, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  status: 'active' | 'inactive';
  image_url?: string;
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { supabase, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
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
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Produk Saya</h1>
          <button
            onClick={() => router.push('/products/add')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Tambah
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-4 py-2 rounded-lg text-black placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-black text-lg mb-2">Belum ada produk</p>
            <p className="text-gray-500 mb-4">Tambahkan produk hasil panen Anda</p>
            <button
              onClick={() => router.push('/products/add')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Tambah Produk
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="text-gray-300" size={32} />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-black truncate">{product.name}</h3>
                  <p className="text-green-600 font-bold">
                    Rp {product.price.toLocaleString('id-ID')}/{product.unit}
                  </p>
                  <p className="text-black text-sm">
                    Stok: {product.stock} {product.unit}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                    product.status === 'active'
                      ? 'bg-green-100 text-black'
                      : 'bg-gray-100 text-black'
                  }`}>
                    {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/products/edit?id=${product.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
        <button onClick={() => router.push('/')} className="flex flex-col items-center p-2 text-gray-500">
          <span className="text-xs">Beranda</span>
        </button>
        <button className="flex flex-col items-center p-2 text-green-600">
          <span className="text-xs font-medium">Produk</span>
        </button>
        <button onClick={() => router.push('/orders')} className="flex flex-col items-center p-2 text-gray-500">
          <span className="text-xs">Pesanan</span>
        </button>
        <button onClick={() => router.push('/profile')} className="flex flex-col items-center p-2 text-gray-500">
          <span className="text-xs">Profil</span>
        </button>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-16"></div>
    </div>
  );
}