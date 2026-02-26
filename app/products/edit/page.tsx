'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  status: 'active' | 'inactive';
  description?: string;
}

function EditProductForm() {
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const { supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError('ID produk tidak ditemukan');
      setIsLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setName(data.name);
      setPrice(data.price.toString());
      setStock(data.stock.toString());
      setUnit(data.unit);
      setStatus(data.status);
      setDescription(data.description || '');
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Produk tidak ditemukan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !price || !stock) {
      setError('Nama, harga, dan stok harus diisi');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price: parseInt(price),
          stock: parseInt(stock),
          unit,
          status,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) throw error;

      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Gagal mengupdate produk');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black mb-4">Produk tidak ditemukan</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/products')} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Edit Produk</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Product Name */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Nama Produk *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Cabai Merah, Bawang Putih"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
            required
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-medium text-black mb-2">
              Harga *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">Rp</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-black"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-medium text-black mb-2">
              Stok *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
              required
            />
          </div>
        </div>

        {/* Unit */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Satuan
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="gram">Gram (g)</option>
            <option value="liter">Liter (L)</option>
            <option value="buah">Buah</option>
            <option value="karung">Karung</option>
            <option value="ikat">Ikat</option>
          </select>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
          >
            <option value="active">Aktif (Tersedia)</option>
            <option value="inactive">Nonaktif (Tidak tersedia)</option>
          </select>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Package size={20} />
              Simpan Perubahan
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    }>
      <EditProductForm />
    </Suspense>
  );
}