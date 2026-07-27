import Link from 'next/link';

export default function ProfilSistemPage() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profil Sistem</h1>
        <p className="text-sm md:text-base text-gray-600">Informasi sistem monitoring</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Informasi Sistem</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 w-1/3 text-xs md:text-base">Nama Sistem</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">Monitoring Air Coolant Mesin Wasino SE-52N2</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Versi</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">2.0 (Next.js 15 + PostgreSQL)</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Mesin</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">Wasino SE-52N2</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Parameter Monitoring</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">
                    <ul className="list-disc list-inside space-y-1">
                      <li>pH Air Coolant (6.0 - 10.0)</li>
                      <li>TDS / Total Dissolved Solids (0 - 1000 ppm)</li>
                      <li>Suhu Air Coolant (20 - 40°C)</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Sensor</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">
                    <ul className="list-disc list-inside space-y-1">
                      <li>pH Sensor Analog</li>
                      <li>TDS Sensor</li>
                      <li>DS18B20 Temperature Sensor</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Mikrokontroler</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">ESP32 DevKit V1</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Interval Update</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">3 detik (realtime)</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Framework</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">Next.js 15 + React 19</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Database</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">PostgreSQL + Prisma ORM</td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Developer</td>
                  <td className="py-2 md:py-3 text-gray-600 text-xs md:text-base">YKK Group IT Team</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">✅ Status Normal</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 w-1/3 text-xs md:text-base">pH Normal</td>
                  <td className="py-2 md:py-3">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800">
                      7.0 - 9.0
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">TDS Normal</td>
                  <td className="py-2 md:py-3">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800">
                      300 - 600 ppm
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 font-medium text-gray-700 text-xs md:text-base">Suhu Normal</td>
                  <td className="py-2 md:py-3">
                    <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800">
                      25 - 30°C
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-3 md:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm md:text-base"
        >
          ← Kembali
        </Link>
      </div>
    </div>
  );
}
