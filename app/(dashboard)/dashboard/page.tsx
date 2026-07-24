'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaTachometerAlt, FaFlask, FaWater, FaThermometerHalf, FaDatabase, FaChartLine, FaInfoCircle, FaDownload, FaFileExcel } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SensorData {
  id: number;
  ph: number;
  tds: number;
  suhu: number;
  waktu: string;
}

export default function DashboardPage() {
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
    if (ph >= 7.0 && ph <= 9.0) return { text: 'Normal', class: 'badge-success' };
    if (ph > 9.0 && ph <= 10.0) return { text: 'Tinggi', class: 'badge-warning' };
    if (ph < 7.0 && ph >= 6.0) return { text: 'Rendah', class: 'badge-warning' };
    return { text: 'Bahaya', class: 'badge-danger' };
  };

  const getStatusTDS = (tds: number) => {
    if (tds >= 300 && tds <= 600) return { text: 'Normal', class: 'badge-success' };
    if (tds > 600 && tds <= 800) return { text: 'Tinggi', class: 'badge-warning' };
    if (tds < 300 && tds >= 200) return { text: 'Rendah', class: 'badge-warning' };
    return { text: 'Bahaya', class: 'badge-danger' };
  };

  const getStatusSuhu = (suhu: number) => {
    if (suhu >= 25 && suhu <= 30) return { text: 'Normal', class: 'badge-success' };
    if (suhu > 30 && suhu <= 35) return { text: 'Tinggi', class: 'badge-warning' };
    if (suhu < 25 && suhu >= 20) return { text: 'Rendah', class: 'badge-warning' };
    return { text: 'Bahaya', class: 'badge-danger' };
  };

  const getBadgeColor = (badgeClass: string) => {
    if (badgeClass === 'badge-success') return 'bg-green-500';
    if (badgeClass === 'badge-warning') return 'bg-yellow-500';
    if (badgeClass === 'badge-danger') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const phChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'pH',
      data: chartData.map((d) => d.ph),
      borderColor: 'rgb(23, 162, 184)',
      backgroundColor: 'rgba(23, 162, 184, 0.1)',
      tension: 0.4,
    }],
  };

  const tdsChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'TDS',
      data: chartData.map((d) => d.tds),
      borderColor: 'rgb(40, 167, 69)',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      tension: 0.4,
    }],
  };

  const suhuChartData = {
    labels: chartData.map((d) => new Date(d.waktu).toLocaleTimeString('id-ID')),
    datasets: [{
      label: 'Suhu',
      data: chartData.map((d) => d.suhu),
      borderColor: 'rgb(255, 193, 7)',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
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
    <div className="p-6 space-y-6 bg-gray-100">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
          <FaTachometerAlt />
          <span>Dashboard Monitoring Realtime</span>
        </h2>
        <p className="text-gray-600 text-sm">Mesin Wasino SE-52N2 - Update otomatis setiap 3 detik</p>
      </div>

      {/* Metric Cards - AdminLTE Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-info text-white rounded-lg shadow-lg relative overflow-hidden">
          <div className="p-6">
            <h3 className="text-4xl font-bold">{latestData?.ph.toFixed(2) || '-'}</h3>
            <p className="mt-1">pH Air Coolant</p>
          </div>
          <div className="absolute bottom-0 right-0 p-4 opacity-20">
            <FaFlask className="text-7xl" />
          </div>
        </div>

        <div className="bg-success text-white rounded-lg shadow-lg relative overflow-hidden">
          <div className="p-6">
            <h3 className="text-4xl font-bold">{latestData?.tds || '-'}</h3>
            <p className="mt-1">TDS (ppm)</p>
          </div>
          <div className="absolute bottom-0 right-0 p-4 opacity-20">
            <FaWater className="text-7xl" />
          </div>
        </div>

        <div className="bg-warning text-white rounded-lg shadow-lg relative overflow-hidden">
          <div className="p-6">
            <h3 className="text-4xl font-bold">{latestData?.suhu.toFixed(2) || '-'}°C</h3>
            <p className="mt-1">Suhu (°C)</p>
          </div>
          <div className="absolute bottom-0 right-0 p-4 opacity-20">
            <FaThermometerHalf className="text-7xl" />
          </div>
        </div>

        <div className="bg-danger text-white rounded-lg shadow-lg relative overflow-hidden">
          <div className="p-6">
            <h3 className="text-4xl font-bold">{latestData?.id || '-'}</h3>
            <p className="mt-1">Total Data Sensor</p>
          </div>
          <div className="absolute bottom-0 right-0 p-4 opacity-20">
            <FaDatabase className="text-7xl" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow">
          <div className="bg-info text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
            <FaChartLine />
            <h3 className="font-semibold">Grafik pH</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              <Line data={phChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="bg-success text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
            <FaChartLine />
            <h3 className="font-semibold">Grafik TDS</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              <Line data={tdsChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="bg-warning text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
            <FaChartLine />
            <h3 className="font-semibold">Grafik Suhu</h3>
          </div>
          <div className="p-4">
            <div className="h-64">
              <Line data={suhuChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Status System & Export */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-white rounded-lg shadow">
          <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
            <FaInfoCircle />
            <h3 className="font-semibold">Status Sistem</h3>
          </div>
          <div className="p-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 w-1/3 font-medium">Status pH</th>
                  <td className="py-3 px-2">
                    {statusPH && (
                      <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getBadgeColor(statusPH.class)}`}>
                        {statusPH.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Status TDS</th>
                  <td className="py-3 px-2">
                    {statusTDS && (
                      <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getBadgeColor(statusTDS.class)}`}>
                        {statusTDS.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Status Suhu</th>
                  <td className="py-3 px-2">
                    {statusSuhu && (
                      <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getBadgeColor(statusSuhu.class)}`}>
                        {statusSuhu.text}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Waktu Update</th>
                  <td className="py-3 px-2">
                    {latestData?.waktu ? new Date(latestData.waktu).toLocaleString('id-ID') : '-'}
                  </td>
                </tr>
                <tr>
                  <th className="text-left py-3 px-2 font-medium">Kondisi Sensor</th>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded bg-green-500 text-white text-sm font-medium">
                      Online
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-lg shadow">
          <div className="bg-secondary text-white px-4 py-3 rounded-t-lg flex items-center space-x-2">
            <FaDownload />
            <h3 className="font-semibold">Export Data</h3>
          </div>
          <div className="p-6 text-center flex flex-col items-center justify-center h-full">
            <button
              onClick={() => alert('Export Excel akan ditambahkan')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-medium transition-colors flex items-center space-x-2"
            >
              <FaFileExcel />
              <span>Export ke Excel</span>
            </button>
            <p className="text-gray-500 text-sm mt-3">Export 50 data terakhir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
