'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaKey, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

export default function GantiPasswordPage() {
  const [form, setForm] = useState({
    password_lama: '',
    password_baru: '',
    konfirmasi_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (form.password_baru !== form.konfirmasi_password) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    if (form.password_baru.length < 6) {
      setError('Password baru minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/ganti-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSuccess('Password berhasil diubah');
      setForm({
        password_lama: '',
        password_baru: '',
        konfirmasi_password: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ganti Password</h1>
        <p className="text-sm md:text-base text-gray-600">Perbarui password akun Anda untuk keamanan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <FaKey className="mr-2 text-purple-600" /> Form Ganti Password
          </h3>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-pulse">
              <p className="font-medium text-sm md:text-base">✅ Password berhasil diubah!</p>
              <p className="text-xs md:text-sm mt-1">Silahkan login ulang dengan password baru</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm md:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Password Lama
              </label>
              <input
                type="password"
                name="password_lama"
                value={form.password_lama}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm md:text-base"
                placeholder="Masukkan password lama"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  name="password_baru"
                  value={form.password_baru}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm md:text-base"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="konfirmasi_password"
                  value={form.konfirmasi_password}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm md:text-base"
                  placeholder="Ulangi password baru"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-90 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm md:text-base"
                >
                  <FaShieldAlt />
                  <span>{loading ? 'Mengubah Password...' : 'Ganti Password'}</span>
                </button>

                <div className="text-xs md:text-sm text-gray-500">
                  <p>Password harus minimal 6 karakter</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Password Requirements */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Pedoman Password Aman</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-xs md:text-sm text-purple-100">Gunakan kombinasi huruf besar, kecil, angka, dan simbol</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-xs md:text-sm text-purple-100">Minimal 6 karakter, lebih panjang lebih aman</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-xs md:text-sm text-purple-100">Jangan gunakan informasi pribadi seperti tanggal lahir</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-xs md:text-sm text-purple-100">Ganti password secara berkala (setiap 3 bulan)</p>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <p className="text-xs md:text-sm text-purple-100">Jangan gunakan password yang sama untuk multiple akun</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-3 md:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm md:text-base"
        >
          <FaArrowLeft className="mr-2" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
