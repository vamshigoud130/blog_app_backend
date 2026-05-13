# Blog Backend - Deployment Fix Guide

## Issue
The Render deployment is failing because files are being looked for in `/opt/render/project/src/` directory structure, but the imports are expecting a different path structure.

## Solution

### Option 1: Fix GitHub Repository Structure (RECOMMENDED)

Your GitHub repository structure should be:
```
blog_app_backend/
├── package.json
├── server.js
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

### Steps to Fix:

1. **Check your GitHub repository structure:**
   - Go to https://github.com/vamshigoud130/blog_app_backend
   - Verify if your files are in a `src/` folder

2. **If files ARE in a `src/` folder:**
   - Move all files from `src/` to the root of the repository
   - Keep only these files at root level: `package.json`, `server.js`, and the folders (APIs/, config/, middleware/, models/, services/)

3. **Verify all imports in the code:**
   - Imports should use relative paths like: `./APIs/UserAPI.js`
   - NOT like: `./src/APIs/UserAPI.js`

4. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix: Remove src folder structure for Render deployment"
   git push origin main
   ```

5. **Redeploy on Render:**
   - Go to your Render dashboard
   - Click "Manual Deploy" or wait for automatic deployment after push

## What to Check

- [ ] GitHub repo structure matches the recommended structure above
- [ ] No `src/` folder exists in the root of the repository
- [ ] `package.json` is at the root level
- [ ] `server.js` is at the root level (not in src/)
- [ ] All imports in files use relative paths (e.g., `../models/UserModel.js`)
- [ ] `.env` file exists on Render with correct environment variables:
  - `DB_URL`
  - `JWT_SECRET`
  - `CLOUD_NAME`
  - `API_KEY`
  - `API_SECRET`
  - `PORT`

## Environment Variables

Set these on Render:
- `PORT`: 3000 (or your preferred port)
- `DB_URL`: Your MongoDB connection string
- `JWT_SECRET`: A strong random string
- `CLOUD_NAME`: Cloudinary cloud name
- `API_KEY`: Cloudinary API key
- `API_SECRET`: Cloudinary API secret
- `NODE_ENV`: production

## Quick Render Setup

1. Connect your GitHub repo to Render
2. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Add Environment Variables from the list above
3. Deploy

## Testing Locally

```bash
cd backend
npm install
npm start
```

Your server should start on http://localhost:3000
