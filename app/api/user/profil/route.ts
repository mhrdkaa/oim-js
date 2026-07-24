import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProfilSchema } from '@/lib/validations';

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    
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
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return new NextResponse(error.errors[0]?.message || 'Validation error', { status: 400 });
    }
    return new NextResponse(error.message || 'Failed to update profile', { status: 500 });
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
  } catch (error: any) {
    return new NextResponse(error.message || 'Failed to fetch profile', { status: 500 });
  }
}
