import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import dotenv from 'dotenv';
dotenv.config()

export const checkUser = async (req, res, next) => {
    // Only verifying the user exists and is active.
    // We allow all logged-in user levels (USER, AUTHOR, ADMIN) to proceed.

    // Check if the user exists and is active
    let userObj = await UserModel.findById(req.user.id);
    if (!userObj || !userObj.isActive) {
        return res.status(403).json({ message: "Forbidden. User account is inactive or not found." });
    }

    next();
}