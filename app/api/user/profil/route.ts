import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProfilSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body: unknown = await request.json();
    
    // Validate with Zod
    const validated = updateProfilSchema.parse(body);

    // Update user
    const user = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        nama: validated.nama,
      },
    });

    return NextResponse.json({
      id: user.id,
      nama: user.nama,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(error.errors[0]?.message || 'Validation error', { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return new NextResponse(message, { status: 500 });
  }
}

// Get user profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return new NextResponse(message, { status: 500 });
  }
}
