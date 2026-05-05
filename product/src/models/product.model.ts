import mongoose from "mongoose"

interface IProduct extends mongoose.Document {
    title: string;
    description: string;
    price: {
        amount: number,
        currency: "USD" | "INR"
    };
    createdAt: Date;
    updatedAt: Date;
    seller: mongoose.Schema.Types.ObjectId;
    images: {
        url: string,
        thumbnail: string,
        id: string
    }[]
}

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            default: "INR"
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId, // don't have a ref as it is in different db
        required: true
    },
    images: [{
        url: String,
        thumbnail: String,
        id: String
    }]
}, { timestamps: true })

export const Product = mongoose.model<IProduct>("product", productSchema);