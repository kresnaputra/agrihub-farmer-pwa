'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    const success = await register(name, email, password, phone);
    setIsLoading(false);

    if (success) {
      // Redirect ke login setelah register sukses
      router.push('/login?registered=true');
    } else {
      setError('Gagal mendaftar. Email mungkin sudah terdaftar.');
    }
  };



  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">A</span>
        </div>
        <h1 className="text-2xl font-bold text-black mb-2">Daftar sebagai Petani</h1>
        <p className="text-black">Bergabung dengan AgriHub sekarang</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-sm mx-auto w-full">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                required
              />
            </div>
            <p className="text-xs text-black mt-1">
              Nomor digunakan untuk komunikasi dengan pembeli
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Daftar
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-black text-sm">
            Sudah punya akun?{' '}
            <a href="/login" className="text-green-600 font-medium hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}