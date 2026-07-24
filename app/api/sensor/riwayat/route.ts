import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get sensor data with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.dataSensor.findMany({
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      prisma.dataSensor.count(),
    ]);

    // Convert Decimal to number
    const formatted = data.map((item) => ({
      id: item.id,
      ph: Number(item.ph),
      tds: item.tds,
      suhu: Number(item.suhu),
      waktu: item.waktu,
    }));

    return NextResponse.json({
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
