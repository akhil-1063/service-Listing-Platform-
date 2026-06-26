import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function sendBookingNotification({
  toEmail,
  customerName,
  serviceName,
  price,
  date,
  timeSlot,
}: {
  toEmail: string;
  customerName: string;
  serviceName: string;
  price: number;
  date: string;
  timeSlot: string;
}) {
  try {
    console.log(`[Email] Dispatching booking request email to ${toEmail}`);
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: toEmail,
      subject: 'New Appointment Request — Doha Wellness',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2D3748; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px;">New Appointment Request</h2>
          <p>Hello,</p>
          <p>You have received a new booking request on Doha Wellness.</p>
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Customer:</td>
              <td style="padding: 8px 0; color: #2D3748;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Service:</td>
              <td style="padding: 8px 0; color: #2D3748;">${serviceName} ($${price})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Date:</td>
              <td style="padding: 8px 0; color: #2D3748;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Time Slot:</td>
              <td style="padding: 8px 0; color: #2D3748;">${timeSlot}</td>
            </tr>
          </table>
          <p>Please log in to your dashboard to confirm or decline this request.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/professional" style="display: inline-block; background-color: #2D3748; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">View Dashboard</a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error sending booking email:", error);
    return { success: false, error };
  }
}

export async function sendConfirmationNotification({
  toEmail,
  salonName,
  serviceName,
  date,
  timeSlot,
  address,
  city,
}: {
  toEmail: string;
  salonName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  address: string;
  city: string;
}) {
  try {
    console.log(`[Email] Dispatching booking confirmation email to ${toEmail}`);
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: toEmail,
      subject: 'Your Appointment is Confirmed — Doha Wellness',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2D3748; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px;">Your Appointment is Confirmed!</h2>
          <p>Hello,</p>
          <p>Great news! Your booking at <strong>${salonName}</strong> has been confirmed.</p>
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Salon:</td>
              <td style="padding: 8px 0; color: #2D3748;">${salonName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Service:</td>
              <td style="padding: 8px 0; color: #2D3748;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Date:</td>
              <td style="padding: 8px 0; color: #2D3748;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Time Slot:</td>
              <td style="padding: 8px 0; color: #2D3748;">${timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4A5568;">Address:</td>
              <td style="padding: 8px 0; color: #2D3748;">${address}, ${city}</td>
            </tr>
          </table>
          <p>We look forward to seeing you. Thank you for booking with Doha Wellness!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/customer" style="display: inline-block; background-color: #2F855A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">My Appointments</a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}
