import exp from 'express'
import { register, login } from '../services/authService.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserModel } from '../models/UserModel.js'
import { checkAuthor } from '../middleware/checkAuthor.js'
import { verifyToken } from '../middleware/verifyToken.js'
import upload from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'
export const authorRouter = exp.Router()

//Register Author(public)
authorRouter.post(
    '/authors',
    upload.single('profilePic'),
    async (req, res, next) => {
        let cloudinaryResult;

        try {
            let userObj = req.body;

            // Step 1: upload image to cloudinary from memoryStorage (if exists)
            if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            }

            // Step 2: call existing register()
            const newUserObj = await register({
                ...userObj,
                role: 'AUTHOR',
                profileImageURL: cloudinaryResult?.secure_url,
            });

            res.status(201).json({
                message: 'author created successfully',
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


//create article(protected)
authorRouter.post('/articles', verifyToken, checkAuthor, async (req, res) => {
    //get article obj from req
    let articleObj = req.body;
    //check fro the author
    let authorObj = await UserModel.findById(articleObj.author);
    if (!authorObj) {
        return res.status(404).json({ message: "author not found" })
    }
    //create article document
    let newArticleObj = new ArticleModel(articleObj);
    //save
    let result = await newArticleObj.save();
    //sned response
    res.status(201).json({ message: 'article created successfully', payload: result });
});

//read article of author(protected) 
authorRouter.get('/articles/:authorId', verifyToken, checkAuthor, async (req, res) => {
    let authorId = req.params.authorId;
    //check the author
    // let authorObj = await UserModel.findById(authorId);
    // if (!authorObj) {
    //     return res.status(404).json({ message: "author not found" })
    // }
    // //get all articles of author
    let articles = await ArticleModel.find({ author: authorId, isArticleActive: true }).populate("author", "firstName lastName email");
    //send response
    res.status(200).json({ message: 'articles fetched successfully', payload: articles });
});


//edit artcle(protected)
authorRouter.put('/articles', verifyToken, checkAuthor, async (req, res) => {
    //get article obj from req
    let { articleId, title, category, content } = req.body;
    //find article
    let result = await ArticleModel.findById(articleId);
    if (!result) {
        return res.status(404).json({ message: "article not found" })
    }
    //check if the logged in author is the owner of the article
    if (result.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden. You can only edit your own articles." });
    }

    //update article document
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,
        {
            $set: { title, category, content }
        },
        { new: true }
    );
    //sned response
    res.status(201).json({ message: 'article updated successfully', payload: updatedArticle });
});

//delete(soft) article(protected)
authorRouter.patch('/articles/:articleId', verifyToken, checkAuthor, async (req, res) => {
    //find article
    let articleId = req.params.articleId;
    //check article is exist
    let articleObj = await ArticleModel.findById(articleId);
    if (!articleObj) {
        return res.status(404).json({ message: "article not found" })
    }
    //check if the logged in author is the owner of the article
    if (articleObj.author.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden. You can only delete your own articles." });
    }
    //delete article
    let result = await ArticleModel.findByIdAndUpdate(articleId,
        {
            $set: { isArticleActive: false }
        },
        { new: true }
    );

    res.status(201).json({ message: 'article deleted successfully', payload: result });
});

