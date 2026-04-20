import mongoose, { Document } from "mongoose";

interface IAddress extends Document {
    street: string,
    city: string,
    state: string,
    pincode: number,
    country: string,
    isDefault: boolean
}

const addressSchema = new mongoose.Schema<IAddress>({
    street: String,
    city: String,
    state: String,
    pincode: Number,
    country: String,
    isDefault: {
        type: Boolean,
        default: false
    }
})

interface IUser extends mongoose.Document {
    username: string;
    fullname: {
        firstName: String;
        lastName: String;
    }
    email: string;
    password?: String;
    role: "user" | "seller";
    addresses: IAddress[];  // embedding instead of referencing (atomic,no joins,performance(read))
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        unique: true,
        select:false
    },
    fullname: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["user", "seller"],
        default: "user"
    },
    addresses: [addressSchema]
}, { timestamps: true })

export const User = mongoose.model<IUser>("user", userSchema);