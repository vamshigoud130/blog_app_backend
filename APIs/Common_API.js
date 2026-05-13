import exp from "express"
import { authenticate } from "../services/authService.js";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import { verifyToken } from "../middleware/verifyToken.js";
export const commonRouter = exp.Router()

//login
commonRouter.post("/login", async (req, res) => {
    //get user cred obj
    let userCred = req.body;
    //call authenticate service
    let { token, user } = await authenticate({ ...userCred });
    //save response token as httpOly cookie
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });

    //send response
    res.status(200).json({ message: "User authenticated successfully", payload: user })
});


//logout
commonRouter.get("/logout", async (req, res) => {
    // clear cookie
    res.clearCookie('token',
        {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        }
    );
    //send response
    res.status(200).json({ message: "User logged out successfully" });
});

//change the password
commonRouter.put("/change-password", verifyToken, async (req, res) => {
    //get current password and new password
    let { currentPassword, newPassword } = req.body;
    let userId = req.user.id;

    //check the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    //check the current password is correct   
    let isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "Invalid current password" })
    }

    //replace the current password with new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    //send response
    res.status(200).json({ message: "Password changed successfully" })
})

commonRouter.get("/check-auth", verifyToken, async (req, res) => {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "authenticated", payload: user });
})