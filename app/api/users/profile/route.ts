import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { name, email, image, password } = await req.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (image) user.image = image;

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error("PUT /api/users/profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
