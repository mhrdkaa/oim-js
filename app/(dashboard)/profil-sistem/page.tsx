import Link from 'next/link';

export default function ProfilSistemPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profil Sistem</h1>
        <p className="text-gray-600">Informasi sistem monitoring</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Sistem</h3>
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 font-medium text-gray-700 w-1/3">Nama Sistem</td>
                <td className="py-3 text-gray-600">Monitoring Air Coolant Mesin Wasino SE-52N2</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Versi</td>
                <td className="py-3 text-gray-600">2.0 (Next.js 15 + PostgreSQL)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Mesin</td>
                <td className="py-3 text-gray-600">Wasino SE-52N2</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Parameter Monitoring</td>
                <td className="py-3 text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>pH Air Coolant (6.0 - 10.0)</li>
                    <li>TDS / Total Dissolved Solids (0 - 1000 ppm)</li>
                    <li>Suhu Air Coolant (20 - 40°C)</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Sensor</td>
                <td className="py-3 text-gray-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>pH Sensor Analog</li>
                    <li>TDS Sensor</li>
                    <li>DS18B20 Temperature Sensor</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Mikrokontroler</td>
                <td className="py-3 text-gray-600">ESP32 DevKit V1</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Interval Update</td>
                <td className="py-3 text-gray-600">3 detik (realtime)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Framework</td>
                <td className="py-3 text-gray-600">Next.js 15 + React 19</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Database</td>
                <td className="py-3 text-gray-600">PostgreSQL + Prisma ORM</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Developer</td>
                <td className="py-3 text-gray-600">YKK Group IT Team</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">✅ Status Normal</h3>
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 font-medium text-gray-700 w-1/3">pH Normal</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    7.0 - 9.0
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">TDS Normal</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    300 - 600 ppm
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">Suhu Normal</td>
                <td className="py-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    25 - 30°C
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Kembali
        </Link>
      </div>
    </div>
  );
}
