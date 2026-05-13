# Quick Deployment Checklist for Render

## Pre-Deployment (Local)

- [x] All imports use correct relative paths with `.js` extension
- [x] All exports are named exports and match the imports
- [x] `package.json` has correct start script: `npm start`
- [x] Error handling middleware is properly configured
- [x] All model exports exist: `UserModel`, `ArticleModel`
- [x] All router exports exist: `userRouter`, `authorRouter`, `adminRouter`, `commonRouter`
- [x] All service exports exist: `register`, `authenticate`, `login`
- [x] All middleware exports exist: `verifyToken`, `checkUser`, `checkAdmin`, `checkAuthor`
- [x] All config exports exist: `cloudinary`, `uploadToCloudinary`, `upload`
- [x] `.env.example` file created with all required variables

## GitHub Repository Structure

Your repository should look like this:
```
blog_app_backend/
├── .env.example
├── .gitignore
├── .nvrignore
├── package.json
├── render.yaml
├── server.js
├── RENDER_DEPLOYMENT_FIX.md
├── APIs/
│   ├── AdminAPI.js
│   ├── AuthorAPI.js
│   ├── CommonAPI.js
│   └── UserAPI.js
├── config/
│   ├── cloudinary.js
│   ├── cloudinaryUpload.js
│   └── multer.js
├── middleware/
│   ├── checkAdmin.js
│   ├── checkAuthor.js
│   ├── checkUser.js
│   └── verifyToken.js
├── models/
│   ├── ArticleModel.js
│   └── UserModel.js
└── services/
    └── authService.js
```

**IMPORTANT:** Make sure there is NO `src/` folder. All files should be directly at the repository root (not nested in a src/ directory).

## Render Environment Variables

Set these environment variables in Render Dashboard:
```
DB_URL=mongodb+srv://[your_connection_string]
JWT_SECRET=[random-secret-key]
CLOUD_NAME=[your-cloudinary-cloud-name]
API_KEY=[your-cloudinary-api-key]
API_SECRET=[your-cloudinary-api-secret]
NODE_ENV=production
PORT=3000
```

## After Fix - To Deploy

```bash
# 1. Verify local structure
ls -la  # Should show APIs/, config/, middleware/, models/, services/, package.json, server.js

# 2. Commit changes
git add .
git commit -m "Fix: Correct import structure and configuration for Render deployment"

# 3. Push to GitHub
git push origin main

# 4. On Render Dashboard
# - Click Manual Deploy
# - Wait for build and deployment
```

## If Still Getting Errors

1. Check the Deployment Logs on Render
2. Verify the exact error message
3. Common issues:
   - Environment variables not set
   - MongoDB connection string incorrect
   - GitHub repo still has `src/` folder
   - Files not pushed to GitHub correctly

## Test Locally

```bash
npm install
npm start
```

Server should start and say: `server started on port 3000`

Test the API:
```bash
curl http://localhost:3000/test
# Should return: {"message":"test api is working"}
```
