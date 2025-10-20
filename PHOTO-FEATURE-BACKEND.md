# 📸 Photo Upload Feature - Cloudinary Integration

## Overview

A Facebook-like photo upload feature where **only admins** can upload photos. Uses Cloudinary for free cloud-based image hosting and optimization.

---

## 🎯 Features Implemented

### Admin Features (Upload Rights)

✅ Upload single or multiple photos (up to 10 at once)
✅ Add title, description, category, and tags
✅ Edit photo details after upload
✅ Delete photos (removes from Cloudinary too)
✅ View upload statistics

### Public Features (View Rights)

✅ Browse photo gallery with pagination
✅ Filter photos by category
✅ Like/unlike photos (authenticated users)
✅ View photo details
✅ Track photo views

### Technical Features

✅ Cloudinary cloud storage (FREE tier)
✅ Automatic image optimization
✅ Image size limiting (max 1200x1200)
✅ File type validation (JPEG, PNG, GIF, WEBP)
✅ File size limit (5MB per file)
✅ Role-based access control (Admin only upload)

---

## 🔧 Backend Setup (Completed)

### 1. Installed Dependencies

```bash
npm install cloudinary multer-storage-cloudinary
```

### 2. Created Files

- ✅ `models/Photo.js` - Photo database schema
- ✅ `config/cloudinary.js` - Cloudinary configuration
- ✅ `routes/photos.js` - Photo API endpoints
- ✅ Updated `server.js` - Added photo routes

---

## 🌥️ Cloudinary Setup (FREE)

### Step 1: Create Free Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email or Google
3. Verify your email

### Step 2: Get Your Credentials

1. After login, go to Dashboard
2. You'll see:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz`

### Step 3: Add to Environment Variables

Open your `.env` file and add:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**⚠️ Important**: Never commit your `.env` file to Git!

### Free Tier Limits (More than enough for testing)

- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Unlimited transformations
- ✅ No credit card required

---

## 📡 API Endpoints

### Upload Photos (Admin Only)

#### Single Photo Upload

```http
POST /api/photos/upload
Headers: x-auth-token: <admin-jwt-token>
Content-Type: multipart/form-data

Body (FormData):
- photo: File
- title: String (required)
- description: String (optional)
- category: String (event|program|beneficiary|facility|other)
- tags: String (comma-separated, optional)

Response:
{
  "message": "Photo uploaded successfully",
  "photo": { ...photoObject }
}
```

#### Multiple Photos Upload

```http
POST /api/photos/upload-multiple
Headers: x-auth-token: <admin-jwt-token>
Content-Type: multipart/form-data

Body (FormData):
- photos: File[] (up to 10)
- title: String
- description: String (optional)
- category: String
- tags: String (comma-separated, optional)

Response:
{
  "message": "5 photo(s) uploaded successfully",
  "photos": [ ...photoObjects ]
}
```

### Get Photos (Public)

#### Get All Photos (Paginated)

```http
GET /api/photos?page=1&limit=20&category=event

Response:
{
  "photos": [ ...photoObjects ],
  "currentPage": 1,
  "totalPages": 5,
  "totalPhotos": 100
}
```

#### Get Single Photo

```http
GET /api/photos/:id

Response:
{
  "_id": "...",
  "title": "Community Event",
  "description": "...",
  "imageUrl": "https://res.cloudinary.com/...",
  "category": "event",
  "tags": ["community", "event"],
  "likes": [...],
  "views": 42,
  "uploadedBy": { "name": "Admin", "email": "..." },
  "createdAt": "2025-10-20T..."
}
```

### Update Photo (Admin Only)

```http
PUT /api/photos/:id
Headers: x-auth-token: <admin-jwt-token>

Body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "program",
  "tags": ["new", "tags"],
  "isActive": true
}
```

### Delete Photo (Admin Only)

```http
DELETE /api/photos/:id
Headers: x-auth-token: <admin-jwt-token>

Response:
{
  "message": "Photo deleted successfully"
}
```

### Like/Unlike Photo (Authenticated Users)

```http
POST /api/photos/:id/like
Headers: x-auth-token: <user-jwt-token>

Response:
{
  "message": "Photo liked",
  "photo": { ...photoObject },
  "likesCount": 15
}
```

### Get Statistics (Admin Only)

```http
GET /api/photos/stats/overview
Headers: x-auth-token: <admin-jwt-token>

Response:
{
  "totalPhotos": 100,
  "totalViews": 5432,
  "totalLikes": 876,
  "categoryStats": [
    { "_id": "event", "count": 45 },
    { "_id": "program", "count": 30 },
    ...
  ]
}
```

---

## 🗄️ Database Schema

### Photo Model

```javascript
{
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  imageUrl: String (Cloudinary URL),
  cloudinaryId: String (for deletion),
  uploadedBy: ObjectId (ref: User),
  category: enum ['event', 'program', 'beneficiary', 'facility', 'other'],
  tags: [String],
  isActive: Boolean (default: true),
  likes: [ObjectId] (ref: User),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes Created

- `{ uploadedBy: 1, createdAt: -1 }` - Fast queries by uploader
- `{ category: 1, isActive: 1 }` - Fast filtering
- `{ tags: 1 }` - Fast tag searches

---

## 🧪 Testing the Backend

### 1. Start the Server

```bash
npm run dev
```

### 2. Test Upload (Using Postman or Thunder Client)

**Setup**:

1. First, login as admin to get JWT token:
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "admin@example.com", "password": "your_password" }
   ```
2. Copy the `token` from response

**Upload Test**:

```
POST http://localhost:5000/api/photos/upload
Headers:
  x-auth-token: <paste-admin-token-here>
Body (form-data):
  photo: <select-image-file>
  title: "Test Photo"
  description: "This is a test upload"
  category: "event"
  tags: "test,demo"
```

**Expected Response**:

```json
{
  "message": "Photo uploaded successfully",
  "photo": {
    "_id": "...",
    "title": "Test Photo",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "cloudinaryId": "ngo-photos/...",
    ...
  }
}
```

### 3. Verify in Cloudinary

1. Login to Cloudinary dashboard
2. Go to Media Library
3. Look for folder: `ngo-photos`
4. Your uploaded image should be there!

### 4. Test Public Access

```
GET http://localhost:5000/api/photos
```

Should return all photos (no auth required)

---

## 🔐 Security Features

### Role-Based Access Control

- ✅ Only admins can upload photos
- ✅ Only admins can edit/delete photos
- ✅ Public can view and like photos
- ✅ JWT authentication required for likes

### File Validation

- ✅ Only image files allowed (JPEG, PNG, GIF, WEBP)
- ✅ Max file size: 5MB
- ✅ Automatic size optimization (max 1200x1200)
- ✅ Auto quality optimization by Cloudinary

### Error Handling

- ✅ Failed uploads cleaned from Cloudinary
- ✅ Database failures rollback Cloudinary uploads
- ✅ Proper error messages for users

---

## 📊 Photo Categories

You can categorize photos into:

- `event` - Community events, gatherings
- `program` - Program activities, workshops
- `beneficiary` - Photos of people helped
- `facility` - NGO buildings, resources
- `other` - Miscellaneous photos

---

## 🎨 Image Optimization (Automatic)

Cloudinary automatically:

- Compresses images for faster loading
- Generates responsive sizes
- Converts to modern formats (WebP when supported)
- Optimizes quality vs file size

---

## 🚀 Next Steps

### Backend is complete! ✅

Now you can:

1. ✅ Upload photos via API (admin only)
2. ✅ Get photos for public display
3. ✅ Like/unlike photos (authenticated users)
4. ✅ Delete photos (removes from Cloudinary)

### Ready for Frontend Integration

You can now build the React frontend to:

- Display photo gallery
- Admin upload interface
- Like/unlike functionality
- Photo detail modals

---

## 💡 Usage Tips

### For Admins:

1. Login to admin panel
2. Navigate to photo upload section
3. Select images and fill details
4. Upload - images go to Cloudinary
5. Manage photos (edit/delete)

### For Public Users:

1. Browse photo gallery
2. Click photos to view details
3. Like photos (must be logged in)
4. Filter by category

---

## 🐛 Troubleshooting

### "Access denied. Admin only"

- Make sure you're logged in as admin
- Check if `role: 'admin'` in your user document

### Upload fails with 401

- JWT token expired or invalid
- Login again to get new token

### Images not showing

- Check Cloudinary credentials in `.env`
- Verify Cloudinary account is active
- Check imageUrl in database matches Cloudinary URL

### "Only image files are allowed"

- Upload only: .jpg, .jpeg, .png, .gif, .webp
- Check file extension

---

## 📝 Environment Variables Checklist

Make sure your `.env` file has:

```bash
✅ MONGODB_URI
✅ JWT_SECRET
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
```

---

## 🎉 Success!

Your backend is now ready with:

- ✅ Cloudinary integration (FREE)
- ✅ Admin-only upload rights
- ✅ Public viewing
- ✅ Like system
- ✅ Category filtering
- ✅ View tracking
- ✅ Secure file handling

**Backend Status**: 100% Complete ✅

**Next**: Build the React frontend to interact with these APIs!

---

Last Updated: October 20, 2025
