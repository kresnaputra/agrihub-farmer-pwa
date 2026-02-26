'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { User, Phone, MapPin, Landmark, Camera, Save, Loader2, ArrowLeft, Shield, Mail, Home } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    village: '',
    city: '',
    province: 'Jawa Barat',
    postalCode: '',
  });

  const [bankAccount, setBankAccount] = useState({
    bankName: 'BCA',
    accountNumber: '',
    accountName: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    
    // Load mock data
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        email: `${user.phone}@agrihub.id`,
        address: 'Jl. Pertanian No. 123',
        village: 'Sukamaju',
        city: 'Bandung',
        province: 'Jawa Barat',
        postalCode: '40123',
      });
      
      setBankAccount({
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountName: user.name || '',
      });
    }
  }, [user, isLoading, router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    alert('Profil berhasil disimpan');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-semibold text-black">Profil Saya</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700"
          >
            {isEditing ? 'Batal' : 'Edit'}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {/* Profile Photo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={48} className="text-green-600" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-4 right-4 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="text-xl font-bold text-black">{profile.name}</h2>
            <p className="text-black flex items-center gap-1 mt-1">
              <Phone size={14} />
              {profile.phone}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                <Shield size={12} />
                Petani Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={18} />
            Informasi Pribadi
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nomor Telepon</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Kode Pos</label>
              <input
                type="text"
                value={profile.postalCode}
                onChange={(e) => setProfile({...profile, postalCode: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Home size={18} />
            Alamat Lengkap
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Alamat Jalan</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Desa/Kelurahan</label>
                <input
                  type="text"
                  value={profile.village}
                  onChange={(e) => setProfile({...profile, village: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Kota/Kabupaten</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Provinsi</label>
                <select
                  value={profile.province}
                  onChange={(e) => setProfile({...profile, province: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
                >
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Banten">Banten</option>
                  <option value="DI Yogyakarta">DI Yogyakarta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Landmark size={18} />
            Rekening Bank
          </h3>
          <p className="text-sm text-black mb-4">
            Informasi rekening untuk pembayaran dari pembeli
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nama Bank</label>
              <select
                value={bankAccount.bankName}
                onChange={(e) => setBankAccount({...bankAccount, bankName: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              >
                <option value="BCA">BCA</option>
                <option value="BRI">BRI</option>
                <option value="BNI">BNI</option>
                <option value="Mandiri">Mandiri</option>
                <option value="CIMB">CIMB Niaga</option>
                <option value="Bank Jabar">Bank Jabar Banten</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Nomor Rekening</label>
              <input
                type="text"
                value={bankAccount.accountNumber}
                onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Nama Pemilik Rekening</label>
              <input
                type="text"
                value={bankAccount.accountName}
                onChange={(e) => setBankAccount({...bankAccount, accountName: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-black"
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Keamanan Akun</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Ubah Kata Sandi</p>
                  <p className="text-sm text-black">Perbarui kata sandi Anda</p>
                </div>
                <ArrowLeft size={16} className="rotate-180" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Verifikasi Email</p>
                  <p className="text-sm text-black">Tambahkan email untuk verifikasi</p>
                </div>
                <ArrowLeft size={16} className="rotate-180" />
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Sesi Aktif</p>
                  <p className="text-sm text-black">Kelola perangkat yang terhubung</p>
                </div>
                <ArrowLeft size={16} className="rotate-180" />
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="sticky bottom-6 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}