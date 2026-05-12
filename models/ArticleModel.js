import { Schema, model } from "mongoose";
import { timeStamp } from "node:console";

//creatind user comment schmea
const userCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String
    }
});

//creating Article Schema
const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "AuthorID is required"]
    },
    title: {
        type: String,
        required: [true, "title is requird"]
    },
    category: {
        type: String,
        required: [true, "category is requird"]
    },
    content: {
        type: String,
        required: [true, "content is requird"]
    },
    comments: {
        type: [userCommentSchema]
    },
    isArticleActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false,
        strict: "throw"
    });

//creating Article Model
export const ArticleModel = model("Article", articleSchema);