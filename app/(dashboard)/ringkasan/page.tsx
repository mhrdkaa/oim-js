'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  avg_ph: number;
  min_ph: number;
  max_ph: number;
  avg_tds: number;
  min_tds: number;
  max_tds: number;
  avg_suhu: number;
  min_suhu: number;
  max_suhu: number;
  total: number;
}

export default function RingkasanPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Simulate stats calculation from chart data
    fetch('/api/sensor/chart')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const phValues = data.map((d: any) => d.ph);
          const tdsValues = data.map((d: any) => d.tds);
          const suhuValues = data.map((d: any) => d.suhu);

          setStats({
            avg_ph: phValues.reduce((a: number, b: number) => a + b, 0) / phValues.length,
            min_ph: Math.min(...phValues),
            max_ph: Math.max(...phValues),
            avg_tds: tdsValues.reduce((a: number, b: number) => a + b, 0) / tdsValues.length,
            min_tds: Math.min(...tdsValues),
            max_tds: Math.max(...tdsValues),
            avg_suhu: suhuValues.reduce((a: number, b: number) => a + b, 0) / suhuValues.length,
            min_suhu: Math.min(...suhuValues),
            max_suhu: Math.max(...suhuValues),
            total: data.length,
          });
        }
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Ringkasan Statistik</h1>
        <p className="text-gray-600">Statistik keseluruhan data sensor (50 data terakhir)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6">
          <p className="text-blue-100 text-sm">Rata-rata pH</p>
          <h3 className="text-4xl font-bold mt-2">
            {stats?.avg_ph.toFixed(2) || '-'}
          </h3>
        </div>

        <div className="bg-green-500 text-white rounded-lg shadow-lg p-6">
          <p className="text-green-100 text-sm">Rata-rata TDS (ppm)</p>
          <h3 className="text-4xl font-bold mt-2">
            {stats?.avg_tds.toFixed(0) || '-'}
          </h3>
        </div>

        <div className="bg-orange-500 text-white rounded-lg shadow-lg p-6">
          <p className="text-orange-100 text-sm">Rata-rata Suhu (°C)</p>
          <h3 className="text-4xl font-bold mt-2">
            {stats?.avg_suhu.toFixed(2) || '-'}°C
          </h3>
        </div>
      </div>

      {/* Detail Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistik pH</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Rata-rata</td>
                <td className="py-2 font-semibold">{stats?.avg_ph.toFixed(2) || '-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Minimum</td>
                <td className="py-2 font-semibold">{stats?.min_ph.toFixed(2) || '-'}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Maximum</td>
                <td className="py-2 font-semibold">{stats?.max_ph.toFixed(2) || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistik TDS</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Rata-rata</td>
                <td className="py-2 font-semibold">{stats?.avg_tds.toFixed(0) || '-'} ppm</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Minimum</td>
                <td className="py-2 font-semibold">{stats?.min_tds || '-'} ppm</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Maximum</td>
                <td className="py-2 font-semibold">{stats?.max_tds || '-'} ppm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Statistik Suhu</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Rata-rata</td>
                <td className="py-2 font-semibold">{stats?.avg_suhu.toFixed(2) || '-'}°C</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Minimum</td>
                <td className="py-2 font-semibold">{stats?.min_suhu.toFixed(2) || '-'}°C</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">Maximum</td>
                <td className="py-2 font-semibold">{stats?.max_suhu.toFixed(2) || '-'}°C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Umum</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>Total Data:</strong> {stats?.total || 0} record (dari 50 data terakhir)</p>
          <p><strong>Sistem:</strong> Monitoring Air Coolant Mesin Wasino SE-52N2</p>
          <p><strong>Update:</strong> Realtime setiap 3 detik</p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        ← Kembali
      </Link>
    </div>
  );
}
