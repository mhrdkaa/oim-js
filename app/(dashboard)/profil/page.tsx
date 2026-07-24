'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaUser, FaSave, FaArrowLeft } from 'react-icons/fa';

export default function ProfilPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [nama, setNama] = useState(session?.user?.name || '');
  const [username, setUsername] = useState(session?.user?.email || '');
  const [role, setRole] = useState(session?.user?.role || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.nama,
        },
      });

      setSuccess('Profil berhasil diperbarui');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profil User</h1>
        <p className="text-gray-600">Kelola informasi profil akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-600" /> Informasi Akun
          </h3>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Nama yang akan ditampilkan di sistem</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSave />
                <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tips Keamanan</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-sm text-blue-100">Username dan role tidak dapat diubah untuk keamanan</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-sm text-blue-100">Pastikan nama Anda terdaftar dengan benar</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-sm text-blue-100">Gunakan password yang kuat dan rutin ganti password</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-sm text-blue-100">Hubungi admin jika perlu perubahan akun</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
