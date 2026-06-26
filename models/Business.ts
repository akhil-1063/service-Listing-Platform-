import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService {
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface IBusiness extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description: string;
  coverImage: string;
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  services: IService[];
  operatingHours: {
    open: string; // e.g., "09:00"
    close: string; // e.g., "20:00"
  };
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }
});

const BusinessSchema: Schema<IBusiness> = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    services: [ServiceSchema],
    operatingHours: {
      open: { type: String, required: true, default: "09:00" },
      close: { type: String, required: true, default: "18:00" }
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Business: Model<IBusiness> = mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);
export default Business;
