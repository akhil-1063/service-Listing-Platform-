import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Business from '@/models/Business';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // Resolve parameters correctly
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid business ID format' }, { status: 400 });
    }

    const business = await Business.findById(id).populate('owner', 'name email image');
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    return NextResponse.json(business);
  } catch (error: any) {
    console.error("GET /api/businesses/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'professional') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid business ID format' }, { status: 400 });
    }

    const business = await Business.findById(id);

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (business.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    business.name = body.name || business.name;
    business.description = body.description || business.description;
    business.coverImage = body.coverImage || business.coverImage;
    if (body.location) {
      business.location = {
        address: body.location.address || business.location.address,
        city: body.location.city || business.location.city,
        coordinates: body.location.coordinates || business.location.coordinates
      };
    }
    if (body.services) {
      business.services = body.services;
    }
    if (body.operatingHours) {
      business.operatingHours = body.operatingHours;
    }

    await business.save();
    return NextResponse.json(business);
  } catch (error: any) {
    console.error("PUT /api/businesses/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
