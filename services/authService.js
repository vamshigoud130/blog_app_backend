import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ArticleModel } from '../models/ArticleModel.js'
import { UserModel } from '../models/UserModel.js'
import { config } from 'dotenv'

export const register = async (userObj) => {
    //Create document 
    const userDoc = new UserModel(userObj);
    //validate the document
    await userDoc.validate();
    //hash and replace plain password
    userDoc.password = await bcrypt.hash(userDoc.password, 10);
    //save
    const created = await userDoc.save();
    //convert doc to obj to remove password
    const userObjWithoutPassword = created.toObject();
    //remove password from response
    delete userObjWithoutPassword.password;
    //return user obj without password
    return userObjWithoutPassword;
};

//authenticate user
export const authenticate = async ({ email, password }) => {
    //find user by email
    const user = await UserModel.findOne({ email });
    //if user not found
    if (!user) {
        const err = new Error('invalid email or role');
        err.statusCode = 401;
        throw err;
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    //if password is not valid
    if (!isPasswordValid) {
        const err = new Error('invalid password');
        err.statusCode = 401;
        throw err;
    }
    //check isActive state
    if (!user.isActive) {
        const err = new Error('User is not active');
        err.statusCode = 401;
        throw err;
    }

    //generate jwt token
    const token = jwt.sign(
        { id: user._id, role: user.role, user: email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    //convert user to object and remove password
    const userObjWithoutPassword = user.toObject();
    delete userObjWithoutPassword.password;

    //return token and user
    return { token, user: userObjWithoutPassword };
};
export const login = async (userCredentials) => {
    //get user obj
    let { email, password, role } = userCredentials;
    //call service
    let { token, user } = await authenticate({ email, password, role });
    //send response
    return { token, user };
};