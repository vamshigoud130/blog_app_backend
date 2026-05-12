import { UserModel } from "../models/UserModel.js";

export const checkAdmin = async (req, res, next) => {
    // get user id from decoded token (set by verifyToken middleware)
    let userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized. Admin access required." });
    }

    // verify admin
    let userObj = await UserModel.findById(userId);

    if (!userObj || userObj.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden. Admin access required." });
    }

    if (!userObj.isActive) {
        return res.status(403).json({ message: "Your account is not active." });
    }

    next();
};
