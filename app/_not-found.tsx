import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Halaman tidak ditemukan</h2>
        <p className="text-purple-100 mb-8 max-w-md mx-auto">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
