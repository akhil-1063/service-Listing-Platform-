import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Business from "@/models/Business";
import ProfessionalAppointments from "./ProfessionalAppointments";

export default async function ProfessionalDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?role=professional");
  }

  if (session.user.role !== "professional") {
    redirect("/dashboard/customer");
  }

  await connectDB();
  const business = await Business.findOne({ owner: session.user.id });

  if (!business) {
    redirect("/onboarding");
  }

  return <ProfessionalAppointments businessId={business._id.toString()} />;
}
