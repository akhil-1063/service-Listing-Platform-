import fs from "fs";
import path from "path";

// Zero-dependency manual env parser to prevent hoisting / package issues
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.error("Manual env parsing error:", e);
}

async function seed() {
  try {
    console.log("Dynamically importing modules...");
    const connectDB = (await import("./lib/mongodb")).default;
    const User = (await import("./models/User")).default;
    const Business = (await import("./models/Business")).default;
    const Review = (await import("./models/Review")).default;
    const Appointment = (await import("./models/Appointment")).default;
    const bcrypt = (await import("bcryptjs")).default;
    const mongoose = (await import("mongoose")).default;

    console.log("Connecting to MongoDB for seeding...");
    await connectDB();
    console.log("Connected successfully. Clearing old data...");

    // Delete existing records
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Appointment.deleteMany({});

    console.log("Data cleared. Creating mock users...");

    // Password hash
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create Customers
    const customer1 = await User.create({
      name: "Sarah Al-Thani",
      email: "sarah@dohawellness.com",
      password: hashedPassword,
      role: "customer",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
    });

    const customer2 = await User.create({
      name: "Omar K.",
      email: "guest@dohawellness.com",
      password: hashedPassword,
      role: "customer",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Omar"
    });

    // Create Professionals
    const prof1 = await User.create({
      name: "Elena Rostova",
      email: "elena@dohawellness.com",
      password: hashedPassword,
      role: "professional",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena"
    });

    const prof2 = await User.create({
      name: "Ahmed Mansoor",
      email: "ahmed@dohawellness.com",
      password: hashedPassword,
      role: "professional",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmed"
    });

    console.log("Users created. Creating salons...");

    // Business 1: Hair & Beauty
    const business1 = await Business.create({
      owner: prof1._id,
      name: "Bella Vista Hair & Beauty Lounge",
      description: "A luxury beauty sanctuary in the heart of West Bay. We specialize in cutting-edge hair styling, organic coloring, balayage, and restorative hair treatments in a premium private lounge.",
      coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
      location: {
        address: "Floor 4, Al Mirqab Tower, West Bay",
        city: "West Bay"
      },
      services: [
        { name: "Signature Haircut & Style", price: 65, duration: 45 },
        { name: "Deep Nourishing Hair Spa", price: 50, duration: 30 },
        { name: "Balayage & Hair Coloring", price: 160, duration: 120 }
      ],
      operatingHours: {
        open: "09:00",
        close: "21:00"
      },
      rating: 4.8,
      reviewCount: 2
    });

    // Business 2: Massage & Spa
    const business2 = await Business.create({
      owner: prof2._id,
      name: "Serene Wellness & Massage Center",
      description: "Escape the stress of daily life. Serene Wellness offers professional massage therapies, aromatherapy, hot stone rituals, and hammam sessions carried out by certified therapists.",
      coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
      location: {
        address: "Marina Promenade, Porto Arabia",
        city: "The Pearl"
      },
      services: [
        { name: "Royal Swedish Massage", price: 110, duration: 60 },
        { name: "Destress Aromatherapy", price: 130, duration: 90 },
        { name: "Deep Tissue Hot Stone Therapy", price: 150, duration: 90 }
      ],
      operatingHours: {
        open: "10:00",
        close: "22:00"
      },
      rating: 4.9,
      reviewCount: 2
    });

    // Business 3: Skin & Facial
    const business3 = await Business.create({
      owner: prof1._id,
      name: "Radiance Skin & Facial Clinic",
      description: "Advanced dermatological facial therapies, LED light skin recovery, microdermabrasion, and rejuvenating anti-aging peels matching clinical grade standards.",
      coverImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000",
      location: {
        address: "Energy Tower, Marina Boulevard",
        city: "Lusail"
      },
      services: [
        { name: "Premium Hydrafacial Session", price: 120, duration: 60 },
        { name: "Anti-Aging Peel & Skin Recovery", price: 95, duration: 45 },
        { name: "LED Collagen Treatment", price: 55, duration: 30 }
      ],
      operatingHours: {
        open: "09:00",
        close: "20:00"
      },
      rating: 4.5,
      reviewCount: 2
    });

    console.log("Salons created. Creating reviews...");

    // Reviews for Salon 1
    await Review.create({
      customer: customer1._id,
      business: business1._id,
      rating: 5,
      comment: "Absolutely outstanding service! The styling team is extremely professional and the atmosphere feels so premium. Highly recommend the Balayage!"
    });
    await Review.create({
      customer: customer2._id,
      business: business1._id,
      rating: 4,
      comment: "Very clean spa and lounge. The haircut was perfect, though the waiting time was about 10 minutes."
    });

    // Reviews for Salon 2
    await Review.create({
      customer: customer1._id,
      business: business2._id,
      rating: 5,
      comment: "The Swedish massage was heavenly! Elena really knows how to untangle knots. Clean towels and calming scents."
    });
    await Review.create({
      customer: customer2._id,
      business: business2._id,
      rating: 5,
      comment: "Simply the best hot stone massage in Doha. The Pearl marina views make it even more peaceful."
    });

    // Reviews for Salon 3
    await Review.create({
      customer: customer1._id,
      business: business3._id,
      rating: 4,
      comment: "Hydrafacial was very professional. My skin feels fresh and hydrated. The clinic is pristine."
    });
    await Review.create({
      customer: customer2._id,
      business: business3._id,
      rating: 5,
      comment: "Incredible anti-aging peel. Ahmed was super knowledgeable about skin recovery products."
    });

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seed();
