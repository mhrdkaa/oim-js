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
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export/excel');
      if (!res.ok) throw new Error('Export gagal');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'data-sensor.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Export gagal, coba lagi');
    } finally {
      setExporting(false);
    }
  };

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
    if (ph > 6.5 && ph < 8.5) return { text: 'Normal', color: 'bg-green-500' };
    if (ph >= 8.5 && ph <= 10.0) return { text: 'Tinggi', color: 'bg-yellow-500' };
    if (ph <= 6.5 && ph >= 6.0) return { text: 'Rendah', color: 'bg-yellow-500' };
    return { text: 'Bahaya', color: 'bg-red-500' };
  };

  const getStatusTDS = (tds: number) => {
    if (tds >= 1000 && tds <= 0) return { text: 'Normal', color: 'bg-green-500' };
    if (tds > 5000 && tds <= 1000) return { text: 'Tinggi', color: 'bg-yellow-500' };
    // if (tds >= 500 && tds <= 1500) return { text: 'Rendah', color: 'bg-yellow-500' };
    return { text: 'Bahaya', color: 'bg-red-500' };
  };

  const getStatusSuhu = (suhu: number) => {
    if (suhu >= 30 && suhu <= 35) return { text: 'Normal', color: 'bg-green-500' };
    if (suhu > 35 && suhu <= 40) return { text: 'Tinggi', color: 'bg-yellow-500' };
    if (suhu >= 20 && suhu < 30) return { text: 'Sangat Baik', color: 'bg-yellow-500' };
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Monitoring Realtime</h1>
        <p className="text-sm md:text-base text-gray-600">Mesin Wasino SE-52N2 - Update otomatis setiap 3 detik</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 md:p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs md:text-sm">pH Air Coolant</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-2">{latestData?.ph.toFixed(2) || '-'}</h3>
            </div>
            <div className="text-3xl md:text-5xl opacity-20">🧪</div>
          </div>
        </div>

        <div className="bg-green-500 text-white rounded-lg shadow-lg p-4 md:p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs md:text-sm">TDS (ppm)</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-2">{latestData?.tds || '-'}</h3>
            </div>
            <div className="text-3xl md:text-5xl opacity-20">💧</div>
          </div>
        </div>

        <div className="bg-orange-500 text-white rounded-lg shadow-lg p-4 md:p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs md:text-sm">Suhu (°C)</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-2">{latestData?.suhu.toFixed(2) || '-'}°C</h3>
            </div>
            <div className="text-3xl md:text-5xl opacity-20">🌡️</div>
          </div>
        </div>

        <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 md:p-6 hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs md:text-sm">Total Data Sensor</p>
              <h3 className="text-2xl md:text-4xl font-bold mt-2">{latestData?.id || '-'}</h3>
            </div>
            <div className="text-3xl md:text-5xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">📈 Grafik pH</h3>
          <div className="h-48 md:h-64">
            <Line data={phChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">📈 Grafik TDS</h3>
          <div className="h-48 md:h-64">
            <Line data={tdsChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">📈 Grafik Suhu</h3>
          <div className="h-48 md:h-64">
            <Line data={suhuChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Status Sistem</h3>
          <h3 className="text-sm md:text-md font-semibold text-gray-700 mb-4">Buzzer akan nyala ketika pH lebih dari 8.5 dan kurang dari 6.5</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 text-sm md:text-base">Status pH</td>
                  <td className="py-3">
                    {statusPH && (
                      <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm ${statusPH.color}`}>
                        {statusPH.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 text-sm md:text-base">Status TDS</td>
                  <td className="py-3">
                    {statusTDS && (
                      <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm ${statusTDS.color}`}>
                        {statusTDS.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 text-sm md:text-base">Status Suhu</td>
                  <td className="py-3">
                    {statusSuhu && (
                      <span className={`px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm ${statusSuhu.color}`}>
                        {statusSuhu.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700 text-sm md:text-base">Waktu Update</td>
                  <td className="py-3 text-gray-600 text-sm md:text-base">
                    {latestData?.waktu ? new Date(latestData.waktu).toLocaleString('id-ID') : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-gray-700 text-sm md:text-base">Kondisi Sensor</td>
                  <td className="py-3">
                    <span className="px-2 md:px-3 py-1 rounded-full bg-green-500 text-white text-xs md:text-sm">Online</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col items-center justify-center">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Export Data</h3>
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {exporting ? 'Exporting...' : 'Export ke Excel'}
          </button>
          <p className="text-gray-500 text-xs md:text-sm mt-2">Export 50 data terakhir</p>
        </div>
      </div>
    </div>
  );
}
