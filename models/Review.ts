import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
