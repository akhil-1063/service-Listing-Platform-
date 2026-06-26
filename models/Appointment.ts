import mongoose, { Schema, Document, Model } from 'mongoose';
import { IService } from './Business';

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  service: IService;
  date: Date;
  timeSlot: string; // e.g. "10:30 AM"
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  createdAt: Date;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    service: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true }
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'completed'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default Appointment;
