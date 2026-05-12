import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    profileImageURL: {
        type: String,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN", "AUTHOR"],
        required: [true, "Role is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
});

//create model
export const UserModel = model("User", userSchema)