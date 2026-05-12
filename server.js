import express from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRouter } from './APIs/userAPI.js'
import { authorRouter } from './APIs/AuthorAPI.js'
import { adminRouter } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/commonAPI.js'
import cors from 'cors'


config()//process .env

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}))

//Add body parser middleware
app.use(express.json())
app.use(cookieParser())

//connect APIs
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
app.use('/user-api', userRouter)
app.use('/author-api', authorRouter)
app.use('/admin-api', adminRouter)
app.use('/common-api', commonRouter)

//root route
app.get('/', (req, res) => {
    res.send({ message: "Blog API is running" })
})

//test route
app.get('/test', (req, res) => {
    res.send({ message: "test api is working" })
})

// Connect to Database
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("DB connection success")
        app.listen(process.env.PORT, () => console.log("server started in port 3000"))
    } catch (err) {
        console.log("Err in DB connection", err)
    }
}

connectDB()

//dealing with invalid paths
app.use((req, res, next) => {
    res.json({ message: "Invalid path" });
})

//error handeling middleware
app.use((err, req, res, next) => {
    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.errors,
        });
    }
    // Invalid ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format",
        });
    }
    // Duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            message: "Duplicate field value",
        });
    }
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});


