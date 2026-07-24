import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { changePasswordSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';

// Change user password
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    
    // Validate with Zod
    const validated = changePasswordSchema.parse(body);

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verify old password
    const isValid = await bcrypt.compare(validated.password_lama, user.password);
    if (!isValid) {
      return new NextResponse('Password lama salah', { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.password_baru, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(error.errors[0]?.message || 'Validation error', { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to change password';
    return new NextResponse(message, { status: 500 });
  }
}
