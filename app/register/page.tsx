'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Store, MapPin } from 'lucide-react';

type UserRole = 'buyer' | 'farmer';

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    const success = await register(name, email, password, phone, role, village, city);
    setIsLoading(false);

    if (success) {
      router.push('/login?registered=true');
    } else {
      setError('Gagal mendaftar. Email mungkin sudah terdaftar.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <button onClick={() => router.push('/')} className="p-2 -ml-2">
            <ArrowRight className="rotate-180" size={24} />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-800">Daftar</h1>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-sm mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Buat Akun</h2>
            <p className="text-gray-500 mt-1">Bergabung dengan AgriHub</p>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-xl p-1 shadow-sm mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
                  role === 'buyer'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={18} />
                Pembeli
              </button>
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
                  role === 'farmer'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Store size={18} />
                Petani
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password * (min 6 karakter)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Address Fields - Only for Farmers */}
            {role === 'farmer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desa/Kelurahan *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="Nama desa"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required={role === 'farmer'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kota/Kabupaten *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Nama kota"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required={role === 'farmer'}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-colors mt-6"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Daftar sebagai {role === 'buyer' ? 'Pembeli' : 'Petani'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <a 
                href="/login" 
                className="text-green-600 font-semibold hover:underline"
              >
                Masuk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}