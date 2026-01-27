import mongoose from "mongoose";

interface IAddress extends Document {
    street: string,
    city: string,
    state: string,
    zip: string,
    country: string
}

const addressSchema = new mongoose.Schema<IAddress>({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
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
    addresses: IAddress;  // embedding instead of referencing (atomic,no joins,performance(read))
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
        unique: true
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
})

export const userModel = mongoose.model<IUser>("user", userSchema);