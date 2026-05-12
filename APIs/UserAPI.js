import exp from 'express'
import { register, login } from '../services/authService.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkUser } from '../middleware/checkUser.js'
import { ArticleModel } from '../models/ArticleModel.js'
import upload from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'

export const userRouter = exp.Router()

//Register User
userRouter.post(
  '/users',
  upload.single('profilePic'),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      //  Step 1: upload image to cloudinary from memoryStorage (if exists)
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Step 2: call existing register()
      const newUserObj = await register({
        ...userObj,
        role: 'USER',
        profileImageURL: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: 'user created successfully',
        payload: newUserObj,
      });
    } catch (err) {
      // Step 3: rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err); // send to your error middleware
    }
  }
);


//read article of user (Available to all users)
userRouter.get('/read-articles', async (req, res) => {
    //get all active articles
    let articles = await ArticleModel.find({ isArticleActive: true }).populate("author", "firstName lastName email").populate("comments.user", "firstName lastName profileImageURL");
    res.status(200).json({ message: 'articles fetched successfully', payload: articles });
})

//get single article by id
userRouter.get('/article/:id', async (req, res) => {
    const article = await ArticleModel.findById(req.params.id).populate("author", "firstName lastName email").populate("comments.user", "firstName lastName profileImageURL");
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json({ message: 'article fetched successfully', payload: article });
})

//add comment to an article
userRouter.put("/articles", verifyToken, checkUser, async (req, res) => {

    //get comment obj 
    const { articleId, comment } = req.body;
    //get user id from req.user (attached by verifyToken)
    const userId = req.user.id;
    //add comment to the article
    let result = await ArticleModel.findByIdAndUpdate(articleId,
        {
            $push: {
                comments: { user: userId, comment: comment }
            }
        },
        { new: true }
    ).populate("author", "firstName lastName email").populate("comments.user", "firstName lastName profileImageURL");
    //send response
    res.status(200).json({ message: "comment added successfully", payload: result });
});

//edit a comment
userRouter.put("/articles/comment", verifyToken, checkUser, async (req, res) => {
    const { articleId, commentId, comment } = req.body;
    const userId = req.user.id;
    
    let result = await ArticleModel.findOneAndUpdate(
        { _id: articleId, "comments._id": commentId, "comments.user": userId },
        {
            $set: { "comments.$.comment": comment }
        },
        { new: true }
    ).populate("author", "firstName lastName email").populate("comments.user", "firstName lastName profileImageURL");
    
    if (!result) return res.status(404).json({ message: "Article or comment not found, or unauthorized" });
    
    res.status(200).json({ message: "comment updated successfully", payload: result });
});

//delete a comment
userRouter.delete("/articles/comment/:articleId/:commentId", verifyToken, checkUser, async (req, res) => {
    const { articleId, commentId } = req.params;
    const userId = req.user.id;
    
    let result = await ArticleModel.findOneAndUpdate(
        { _id: articleId, "comments._id": commentId, "comments.user": userId },
        {
            $pull: { comments: { _id: commentId } }
        },
        { new: true }
    ).populate("author", "firstName lastName email").populate("comments.user", "firstName lastName profileImageURL");
    
    if (!result) return res.status(404).json({ message: "Article or comment not found, or unauthorized" });
    
    res.status(200).json({ message: "comment deleted successfully", payload: result });
});