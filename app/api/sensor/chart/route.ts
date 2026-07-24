import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get 50 latest sensor data for chart (reversed)
export async function GET() {
  try {
    const data = await prisma.dataSensor.findMany({
      orderBy: { id: 'desc' },
      take: 50,
    });

    // Reverse untuk ascending order & convert Decimal to number
    const reversed = data.reverse().map((item) => ({
      id: item.id,
      ph: Number(item.ph),
      tds: item.tds,
      suhu: Number(item.suhu),
      waktu: item.waktu,
    }));

    return NextResponse.json(reversed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
