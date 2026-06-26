import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Business from '@/models/Business';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendBookingNotification } from '@/lib/mailer';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (session.user.role === 'customer') {
      const appointments = await Appointment.find({ customer: session.user.id })
        .populate('business')
        .sort({ date: 1, timeSlot: 1 });
      return NextResponse.json(appointments);
    } else if (session.user.role === 'professional') {
      const business = await Business.findOne({ owner: session.user.id });
      if (!business) {
        return NextResponse.json([]);
      }

      const appointments = await Appointment.find({ business: business._id })
        .populate('customer', 'name email image')
        .sort({ date: 1, timeSlot: 1 });
      return NextResponse.json(appointments);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    console.error("GET /api/appointments error:", error);
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
    const body = await req.json();

    const { businessId, service, date, timeSlot } = body;

    if (!businessId || !service || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const business = await Business.findById(businessId).populate('owner');
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const appointment = await Appointment.create({
      customer: session.user.id,
      business: businessId,
      service,
      date: new Date(date),
      timeSlot,
      status: 'pending',
    });

    const professionalUser = business.owner as any;
    if (professionalUser && professionalUser.email) {
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      await sendBookingNotification({
        toEmail: professionalUser.email,
        customerName: session.user.name || 'A customer',
        serviceName: service.name,
        price: service.price,
        date: formattedDate,
        timeSlot,
      });
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
