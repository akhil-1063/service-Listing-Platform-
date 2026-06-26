import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Business from '@/models/Business';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : 0;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : Infinity;

    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'services.name': { $regex: query, $options: 'i' } }
      ];
    }

    if (location) {
      // If we already have $or from query, we match both in a list or append
      const locFilter = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
      if (filter.$or) {
        // Query must match or location must match
        filter.$and = [
          { $or: filter.$or },
          { $or: locFilter }
        ];
        delete filter.$or;
      } else {
        filter.$or = locFilter;
      }
    }

    if (rating > 0) {
      filter.rating = { $gte: rating };
    }

    if (minPrice > 0 || maxPrice < Infinity) {
      filter.services = {
        $elemMatch: {
          price: { $gte: minPrice, $lte: maxPrice }
        }
      };
    }

    const businesses = await Business.find(filter).populate('owner', 'name email image');
    return NextResponse.json(businesses);
  } catch (error: any) {
    console.error("GET /api/businesses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'professional') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Check if user already has a business listed
    const existingBusiness = await Business.findOne({ owner: session.user.id });
    if (existingBusiness) {
      return NextResponse.json({ error: 'Business already listed for this user' }, { status: 400 });
    }

    const newBusiness = await Business.create({
      owner: session.user.id,
      name: body.name,
      description: body.description,
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000',
      location: {
        address: body.location.address,
        city: body.location.city,
        coordinates: body.location.coordinates || {}
      },
      services: body.services || [],
      operatingHours: body.operatingHours || { open: '09:00', close: '18:00' },
      rating: 0,
      reviewCount: 0
    });

    return NextResponse.json(newBusiness, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/businesses error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
