import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { register } from '../services/authService.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
export const adminRouter = exp.Router()

//Register Admin(public)
adminRouter.post('/admins', async (req, res) => {
    //get user obj
    let userObj = req.body;
    //call service
    const newUserObj = await register({ ...userObj, role: "ADMIN" });
    //send response
    res.status(201).json({ message: 'admin created successfully', payload: newUserObj });
});

adminRouter.use(verifyToken, checkAdmin);

//read all article of admin
adminRouter.get("/articles/:authorId", async (req, res) => {
    let authorId = req.params.authorId;

    // Check if the author exists and is active
    let author = await UserModel.findById(authorId);
    if (!author) {
        return res.status(404).json({ message: 'Author not found' })
    }
    if (!author.isActive) {
        return res.status(403).json({ message: 'Author is not active' })
    }

    let articles = await ArticleModel.find({ author: authorId, isArticleActive: true })
    res.status(200).json({ message: 'article fetched successfully', payload: articles })
})
//block user
adminRouter.put("/block-user", async (req, res) => {
    let { userId } = req.body;
    let user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    user.isActive = false;
    await user.save();
    res.status(200).json({ message: 'User blocked successfully' })
})
//unblock user
adminRouter.put("/unblock-user", async (req, res) => {
    let { userId } = req.body;
    let user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    user.isActive = true;
    await user.save();
    res.status(200).json({ message: 'User unblocked successfully' })
})


