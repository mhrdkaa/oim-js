import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';

// Export 50 latest sensor data to Excel
export async function GET() {
  try {
    const data = await prisma.dataSensor.findMany({
      orderBy: { id: 'desc' },
      take: 50,
    });

    // Prepare data for Excel
    const excelData = data.map((item, index) => ({
      'No': index + 1,
      'ID': item.id,
      'Waktu': new Date(item.waktu).toLocaleString('id-ID'),
      'pH': Number(item.ph),
      'TDS (ppm)': item.tds,
      'Suhu (C)': Number(item.suhu),
      'pH Status': getPHStatus(Number(item.ph)),
      'TDS Status': getTDSStatus(item.tds),
      'Suhu Status': getSuhuStatus(Number(item.suhu)),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },   // No
      { wch: 8 },   // ID
      { wch: 22 },  // Waktu
      { wch: 10 },  // pH
      { wch: 12 },  // TDS
      { wch: 10 },  // Suhu
      { wch: 12 },  // pH Status
      { wch: 12 },  // TDS Status
      { wch: 12 },  // Suhu Status
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Sensor');

    // Generate Excel buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `data-sensor-${timestamp}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}

function getPHStatus(ph: number): string {
  if (ph >= 7.0 && ph <= 9.0) return 'Normal';
  if (ph > 9.0 && ph <= 10.0) return 'Tinggi';
  if (ph < 7.0 && ph >= 6.0) return 'Rendah';
  return 'Bahaya';
}

function getTDSStatus(tds: number): string {
  if (tds >= 300 && tds <= 600) return 'Normal';
  if (tds > 600 && tds <= 800) return 'Tinggi';
  if (tds < 300 && tds >= 200) return 'Rendah';
  return 'Bahaya';
}

function getSuhuStatus(suhu: number): string {
  if (suhu >= 25 && suhu <= 30) return 'Normal';
  if (suhu > 30 && suhu <= 35) return 'Tinggi';
  if (suhu < 25 && suhu >= 20) return 'Rendah';
  return 'Bahaya';
}
