'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SensorData {
  id: number;
  ph: number;
  tds: number;
  suhu: number;
  waktu: string;
}

export default function DashboardContent() {
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<SensorData[]>([]);

  const loadData = async () => {
    try {
      const [latestRes, chartRes] = await Promise.all([
        fetch('/api/sensor/latest'),
        fetch('/api/sensor/chart'),
      ]);

      const latest = await latestRes.json();
      const chart = await chartRes.json();

      setLatestData(latest);
      setChartData(chart);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusPH = (ph: number) => {
    if (ph >= 7.0 && ph <= 9.0) return { text: 'Normal', color: 'bg-green-500' };
    if (ph > 9.0 && ph <= 10.0) return { text: 'Tinggi', color: 'bg-yellow-500' };
    if (ph < 7.0 && ph >= 6.0) return { text: 'Rendah', color: 'bg-yellow-500' };
    return { text: 'Bahaya', color: 'bg-red-500' };
  };

  const getStatusTDS = (tds: number) => {
    if (tds >= 300 && tds <= 600) return { text: 'Normal', color: 'bg-green-500' };
    if (tds > 600 && tds <= 800) return { text: 'Tinggi', color: 'bg-yellow-500' };
    if (tds < 300 && tds >= 200) return { text: 'Rendah', color: 'bg-yellow-500' };
    return { text: 'Bahaya', color: 'bg-red-500' };
  };

  const getStatusSuhu = (suhu: number) => {
    if (suhu >= 25 && suhu <= 30) return { text: 'Normal', color: 'bg-green-500' };
    if (suhu > 30 && suhu <= 35) return { text: 'Tinggi', color: 'bg-yellow-500' };
    if (suhu < 25 && suhu >= 20) return { text: 'Rendah', color: 'bg-yellow-500' };
    return { text: 'Bahaya', color: 'bg-red-500' };
  };

  const phChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'pH',
      data: chartData.map((d) => d.ph),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  };

  const tdsChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'TDS',
      data: chartData.map((d) => d.tds),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
    }],
  };

  const suhuChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'Suhu',
      data: chartData.map((d) => d.suhu),
      borderColor: 'rgb(251, 146, 60)',
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const statusPH = latestData ? getStatusPH(latestData.ph) : null;
  const statusTDS = latestData ? getStatusTDS(latestData.tds) : null;
  const statusSuhu = latestData ? getStatusSuhu(latestData.suhu) : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Monitoring Realtime</h1>
        <p className="text-gray-600">Mesin Wasino SE-52N2 - Update otomatis setiap 3 detik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">pH Air Coolant</p>
              <h3 className="text-4xl font-bold mt-2">{latestData?.ph.toFixed(2) || '-'}</h3>
            </div>
            <div className="text-5xl opacity-20">🧪</div>
          </div>
        </div>

        <div className="bg-green-500 text-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">TDS (ppm)</p>
              <h3 className="text-4xl font-bold mt-2">{latestData?.tds || '-'}</h3>
            </div>
            <div className="text-5xl opacity-20">💧</div>
          </div>
        </div>

        <div className="bg-orange-500 text-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Suhu (°C)</p>
              <h3 className="text-4xl font-bold mt-2">{latestData?.suhu.toFixed(2) || '-'}°C</h3>
            </div>
            <div className="text-5xl opacity-20">🌡️</div>
          </div>
        </div>

        <div className="bg-red-500 text-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Data Sensor</p>
              <h3 className="text-4xl font-bold mt-2">{latestData?.id || '-'}</h3>
            </div>
            <div className="text-5xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Grafik pH</h3>
          <div className="h-64">
            <Line data={phChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Grafik TDS</h3>
          <div className="h-64">
            <Line data={tdsChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📈 Grafik Suhu</h3>
          <div className="h-64">
            <Line data={suhuChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">ℹ️ Status Sistem</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Status pH</td>
                <td className="py-3">
                  {statusPH && (
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${statusPH.color}`}>
                      {statusPH.text}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Status TDS</td>
                <td className="py-3">
                  {statusTDS && (
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${statusTDS.color}`}>
                      {statusTDS.text}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Status Suhu</td>
                <td className="py-3">
                  {statusSuhu && (
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${statusSuhu.color}`}>
                      {statusSuhu.text}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium text-gray-700">Waktu Update</td>
                <td className="py-3 text-gray-600">
                  {latestData?.waktu ? new Date(latestData.waktu).toLocaleString('id-ID') : '-'}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Kondisi Sensor</td>
                <td className="py-3">
                  <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">Online</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">💾 Export Data</h3>
          <button
            onClick={() => alert('Export Excel akan ditambahkan')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📥 Export ke Excel
          </button>
          <p className="text-gray-500 text-sm mt-2">Export 50 data terakhir</p>
        </div>
      </div>
    </div>
  );
}
