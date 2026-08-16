import { NextResponse } from 'next/server';
import { db } from '@/db/connect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, email } = body;

    const updateData: { firstName?: string; lastName?: string; email?: string } = {};

    if (typeof firstName === 'string' && firstName.trim() !== '') {
      updateData.firstName = firstName.trim();
    }

    if (typeof lastName === 'string' && lastName.trim() !== '') {
      updateData.lastName = lastName.trim();
    }

    if (typeof email === 'string' && email.trim() !== '') {
      updateData.email = email.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one field to update' },
        { status: 400 }
      );
    }

    if (updateData.email) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
    }

    if (updateData.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: parseInt(session.user.id) },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { id: parseInt(session.user.id) },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
