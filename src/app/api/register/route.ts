import { NextResponse } from 'next/server';
import { db } from '@/db/connect';
import { hashFunction, compareFunction } from '@/utils/hashFunction';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const password = String(body.password || '').trim();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      if (!existingUserByEmail.password) {
        const hashedPassword = await hashFunction(password);

        const updatedUser = await db.user.update({
          where: { id: existingUserByEmail.id },
          data: {
            firstName: existingUserByEmail.firstName || firstName,
            lastName: existingUserByEmail.lastName || lastName,
            password: hashedPassword,
            provider: 'credentials',
          },
        });

        const { password: _password, ...rest } = updatedUser;
        return NextResponse.json(
          { user: rest, message: 'User Created Successfully' },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashFunction(password);

    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        provider: 'credentials',
      },
    });

    const { password: _newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: 'User Created Successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/register:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
