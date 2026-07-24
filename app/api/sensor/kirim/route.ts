import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sensorDataSchema } from '@/lib/validations';

// ESP32 kirim data sensor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const data = {
      ph: searchParams.get('ph'),
      tds: searchParams.get('tds'),
      suhu: searchParams.get('suhu'),
    };

    // Validate dengan Zod
    const validated = sensorDataSchema.parse(data);

    // Simpan ke database
    await prisma.dataSensor.create({
      data: validated,
    });

    // Return plain text "OK" untuk ESP32
    return new NextResponse('OK', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Validation error', { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
