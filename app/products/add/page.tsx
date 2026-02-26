'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { ArrowLeft, Package, Upload, Loader2 } from 'lucide-react';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { supabase, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !price || !stock) {
      setError('Nama, harga, dan stok harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            user_id: user?.id,
            name,
            price: parseInt(price),
            stock: parseInt(stock),
            unit,
            description,
            status: 'active',
          },
        ]);

      if (error) throw error;

      router.push('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Gagal menambahkan produk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/products')} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Tambah Produk</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Product Image */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Foto Produk
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-black text-sm">Upload foto (opsional)</p>
            <p className="text-gray-500 text-xs mt-1">Fitur upload akan segera hadir</p>
          </div>
        </div>

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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black placeholder:text-gray-400"
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
                placeholder="25000"
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
              placeholder="100"
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

        {/* Description */}
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm font-medium text-black mb-2">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi produk, kualitas, dsb..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black placeholder:text-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Package size={20} />
              Simpan Produk
            </>
          )}
        </button>
      </form>
    </div>
  );
}