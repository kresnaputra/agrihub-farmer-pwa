'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, User, Store } from 'lucide-react';

type UserRole = 'buyer' | 'farmer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, supabase } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      try {
        // Check user role from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', result.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setError('Gagal mengambil data profil. Silakan coba lagi.');
          return;
        }

        if (!profile) {
          console.error('Profile not found for user:', result.user.id);
          setError('Profil tidak ditemukan. Silakan daftar ulang.');
          return;
        }

        console.log('Login success, role:', profile.role);

        // Redirect based on role
        if (profile?.role === 'admin') {
          router.push('/admin');
        } else if (profile?.role === 'farmer') {
          router.push('/dashboard');
        } else {
          router.push('/'); // Buyer goes to marketplace
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } else {
      setError('Email atau password salah');
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
          <h1 className="ml-2 text-lg font-semibold text-gray-800">Masuk</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
            <p className="text-gray-500 mt-1">Masuk ke akun AgriHub Anda</p>
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
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Masuk sebagai {role === 'buyer' ? 'Pembeli' : 'Petani'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <a 
                href="/register" 
                className="text-green-600 font-semibold hover:underline"
              >
                Daftar
              </a>
            </p>
          </div>

          {/* Benefits Info */}
          <div className="mt-8 p-4 bg-green-50 rounded-xl">
            <p className="text-sm font-medium text-green-800 mb-2">
              Keuntungan {role === 'buyer' ? 'Pembeli' : 'Petani'}:
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              {role === 'buyer' ? (
                <>
                  <li>• Beli langsung dari petani</li>
                  <li>• Harga lebih murah</li>
                  <li>• Produk segar berkualitas</li>
                </>
              ) : (
                <>
                  <li>• Jual produk langsung ke pembeli</li>
                  <li>• Harga lebih menguntungkan</li>
                  <li>• Kelola pesanan dengan mudah</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}