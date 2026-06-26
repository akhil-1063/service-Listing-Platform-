import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendConfirmationNotification } from '@/lib/mailer';

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
    const { status } = await req.json();

    if (!['confirmed', 'declined', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const appointment = await Appointment.findById(id)
      .populate('business')
      .populate('customer');

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const business = appointment.business as any;
    if (business.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    appointment.status = status;
    await appointment.save();

    if (status === 'confirmed') {
      const customerUser = appointment.customer as any;
      if (customerUser && customerUser.email) {
        const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        await sendConfirmationNotification({
          toEmail: customerUser.email,
          salonName: business.name,
          serviceName: appointment.service.name,
          date: formattedDate,
          timeSlot: appointment.timeSlot,
          address: business.location.address,
          city: business.location.city,
        });
      }
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error("PUT /api/appointments/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
