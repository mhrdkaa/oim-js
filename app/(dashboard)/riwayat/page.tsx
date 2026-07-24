'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SensorData {
  id: number;
  ph: number;
  tds: number;
  suhu: number;
  waktu: string;
}

export default function RiwayatPage() {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sensor/chart')
      .then((res) => res.json())
      .then((data) => {
        setData(data.reverse()); // Latest first
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Data Sensor</h1>
        <p className="text-gray-600">Semua data sensor yang tercatat dalam sistem</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Data Sensor</h3>
          <span className="text-sm text-gray-500">Total: {data.length} data (50 terakhir)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">pH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">TDS (ppm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Suhu (°C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data sensor
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(item.waktu).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.ph.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {item.tds}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {item.suhu.toFixed(2)}°C
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
