# 📸 Simple Photo Feature - Admin Upload Only

## What It Does

**Simple & Clean:**

- ✅ Admin can upload photos to Cloudinary (FREE cloud storage)
- ✅ Public can view photo gallery
- ❌ No likes, no comments, no views tracking
- ❌ Public cannot see individual photo details

---

## 🔧 Setup (5 minutes)

### 1. Get FREE Cloudinary Account

```
https://cloudinary.com/users/register_free
```

### 2. Add to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Done! ✅

---

## 📡 API Endpoints (Only 5!)

### ADMIN ONLY:

#### Upload Single Photo

```http
POST /api/photos/upload
Headers: x-auth-token: <admin-jwt>
Body (form-data):
  photo: <image-file>
  title: "Event Photo"
  description: "Description here"
  category: "event"
  tags: "charity,event"
```

#### Upload Multiple Photos

```http
POST /api/photos/upload-multiple
Headers: x-auth-token: <admin-jwt>
Body (form-data):
  photos: <multiple-files>
  title: "Event Photos"
  category: "event"
```

#### Update Photo

```http
PUT /api/photos/:id
Headers: x-auth-token: <admin-jwt>
Body: { "title": "New Title", "category": "program" }
```

#### Delete Photo

```http
DELETE /api/photos/:id
Headers: x-auth-token: <admin-jwt>
```

### PUBLIC:

#### Get All Photos (Gallery)

```http
GET /api/photos
GET /api/photos?category=event  (filter by category)

Returns:
[
  {
    "_id": "...",
    "title": "Photo Title",
    "description": "...",
    "imageUrl": "https://res.cloudinary.com/...",
    "category": "event",
    "tags": ["charity", "event"],
    "createdAt": "2025-10-20T..."
  }
]
```

**That's it! Simple.**

---

## 📂 Photo Categories

- `event` - Events, gatherings
- `program` - Programs, workshops
- `beneficiary` - People helped
- `facility` - Buildings, equipment
- `other` - Miscellaneous

---

## 🧪 Quick Test

### 1. Login as Admin

```bash
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@...", "password": "..." }
```

→ Copy the `token`

### 2. Upload Photo

```bash
POST http://localhost:5000/api/photos/upload
Headers: x-auth-token: <paste-token>
Body: photo file + title
```

### 3. View Gallery (Public - No Auth!)

```bash
GET http://localhost:5000/api/photos
```

---

## ✅ What's Included

✅ Admin uploads to Cloudinary
✅ Public views gallery
✅ Filter by category
✅ Auto image optimization
✅ Admin can edit/delete

## ❌ What's NOT Included

❌ No likes
❌ No comments
❌ No view counting
❌ No individual photo page for public
❌ No user upload (admin only)

---

## 📦 Files Created

- `models/Photo.js` - Database schema
- `config/cloudinary.js` - Cloud config
- `routes/photos.js` - 5 simple endpoints
- Updated `server.js`

---

## 🎯 Status

**Backend: Complete ✅**
**Next: Build simple frontend gallery**

---

Last Updated: October 20, 2025
