import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get latest sensor data
export async function GET() {
  try {
    const data = await prisma.dataSensor.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!data) {
      return NextResponse.json({
        id: null,
        ph: 0,
        tds: 0,
        suhu: 0,
        waktu: null,
      });
    }

    return NextResponse.json({
      id: data.id,
      ph: Number(data.ph),
      tds: data.tds,
      suhu: Number(data.suhu),
      waktu: data.waktu,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
