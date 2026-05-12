import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const checkAuthor = async (req, res, next) => {
    console.log("checkAuthor - req.user:", req.user);
    // Role verification strictly from token
    if (req.user?.role !== "AUTHOR") {
        return res.status(403).json({ message: "Forbidden. Author access required. Current role: " + req.user?.role });
    }

    // Check if the author exists and is active
    let authorObj = await UserModel.findById(req.user.id);
    if (!authorObj) {
        return res.status(403).json({ message: "Forbidden. Author account not found." });
    }
    if (!authorObj.isActive) {
        return res.status(403).json({ message: "Forbidden. Author account is inactive." });
    }

    next();
};