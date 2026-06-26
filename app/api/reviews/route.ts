import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Business from '@/models/Business';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId parameter' }, { status: 400 });
    }

    const reviews = await Review.find({ business: businessId })
      .populate('customer', 'name email image')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { businessId, rating, comment } = await req.json();

    if (!businessId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const existingReview = await Review.findOne({ customer: session.user.id, business: businessId });
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this business' }, { status: 400 });
    }

    const review = await Review.create({
      customer: session.user.id,
      business: businessId,
      rating,
      comment
    });

    const allReviews = await Review.find({ business: businessId });
    const reviewCount = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    business.reviewCount = reviewCount;
    business.rating = Math.round(avgRating * 10) / 10;
    await business.save();

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
