import {Schema,model,Document} from 'mongoose';



export interface IServiceProvider extends Document {
    name: string;
    category: string;
    description: string;
    location: string;
    imageUrl: string;
}

export const ServiceProviderSchema = new Schema<IServiceProvider>({
    name: { type: String, required: [true , "Name is required" ],trim : true},
    category: { type: String, required: [true, "Category is required" ], trim: true,index: true },
    description: { type: String,required: [true, "Description is required" ] },
    location: { type: String, required: [true, "Location is required" ],index: true },
    imageUrl: { type: String, required: [true, "Image URL is required" ]}
}, { timestamps: true });

export const ServiceProvider = model<IServiceProvider>('serviceprovider',ServiceProviderSchema);