import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'professional';
  image?: string;
  googleId?: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // null for OAuth
    role: { type: String, enum: ['customer', 'professional'], default: 'customer' },
    image: { type: String },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
