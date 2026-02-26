'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Phone, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, requestOTP } = useAuth();
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name.length < 3) {
      setError('Nama minimal 3 karakter');
      return;
    }
    
    if (phone.length < 10) {
      setError('Nomor telepon tidak valid');
      return;
    }

    setIsLoading(true);
    const success = await requestOTP(phone);
    setIsLoading(false);

    if (success) {
      setStep('otp');
      alert('Kode OTP: 123456 (Demo)');
    } else {
      setError('Gagal mengirim OTP');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await register(phone, name);
    setIsLoading(false);

    if (success) {
      router.push('/');
    } else {
      setError('Registrasi gagal');
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
        <p className="text-gray-700">Bergabung dengan AgriHub sekarang</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-sm mx-auto w-full">
        {step === 'form' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
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
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  required
                />
              </div>
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
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Lanjutkan
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Kode OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-center tracking-widest"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Masukkan 6 digit kode yang dikirim ke {phone}
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
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Daftar'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-gray-700 py-2 text-sm hover:text-black"
            >
              Ganti nomor telepon
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-700">
            Sudah punya akun?{' '}
            <a href="/login" className="text-green-600 font-medium hover:text-green-700">
              Masuk
            </a>
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 max-w-sm mx-auto">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-black mb-2">Keuntungan bergabung:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Akses ke ribuan pembeli</li>
            <li>• Harga pasar real-time</li>
            <li>• Pembayaran aman & cepat</li>
            <li>• Gratis biaya pendaftaran</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
