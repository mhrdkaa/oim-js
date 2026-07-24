'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SensorData {
  id: number;
  ph: number;
  tds: number;
  suhu: number;
  waktu: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function RiwayatPage() {
  const [data, setData] = useState<SensorData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sensor/riwayat?page=${page}&limit=50`);
      const result = await res.json();
      
      setData(result.data);
      setPagination(result.pagination);
      setCurrentPage(result.pagination.page);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadData(page);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Data Sensor</h1>
        <p className="text-gray-600">Semua data sensor yang tercatat dalam sistem</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Data Sensor</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Halaman {currentPage} dari {pagination.totalPages}
            </span>
            <span className="text-sm text-gray-500">
              Total: {pagination.total} data
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">No</th>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data sensor
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {((currentPage - 1) * 50) + index + 1}
                    </td>
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

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {data.length} of {pagination.total} records
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FaChevronLeft className="mr-1 text-xs" />
                Prev
              </button>
              
              <div className="flex items-center space-x-1">
                {/* Smart pagination logic */}
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  
                  // Always show page 1
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className={`px-3 py-1 rounded text-sm font-medium ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      1
                    </button>
                  );
                  
                  if (totalPages <= 7) {
                    // Show all pages if <= 7
                    for (let i = 2; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 rounded text-sm font-medium ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else {
                    // For many pages, show smart range
                    let start = Math.max(2, currentPage - 2);
                    const end = Math.min(totalPages - 1, currentPage + 2);
                    
                    // Adjust start if we're near the end
                    if (totalPages - end < 2) {
                      start = Math.max(2, totalPages - 4);
                    }
                    
                    // Gap after page 1
                    if (start > 2) {
                      pages.push(
                        <span key="gap1" className="text-gray-500 px-1">
                          ...
                        </span>
                      );
                    }
                    
                    // Show range around current page
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 rounded text-sm font-medium ${currentPage === i ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Gap before last page
                    if (end < totalPages - 1) {
                      pages.push(
                        <span key="gap2" className="text-gray-500 px-1">
                          ...
                        </span>
                      );
                    }
                    
                    // Always show last page
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1 rounded text-sm font-medium ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              50 per page
            </div>
          </div>
        )}
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}
