# 📸 Photo Feature - Quick Reference Card

## 🚀 30-Second Setup

### 1. Get Cloudinary (FREE)

→ https://cloudinary.com/users/register_free

### 2. Add to `.env`

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Done! ✅

---

## 🧪 Quick Test

### Upload Photo (Admin):

```bash
POST http://localhost:5000/api/photos/upload
Headers: x-auth-token: <admin-jwt-token>
Body (form-data):
  photo: <image-file>
  title: "Test Photo"
  category: "event"
```

### View Photos (Public):

```bash
GET http://localhost:5000/api/photos
```

---

## 📋 File Checklist

✅ Created:

- `models/Photo.js`
- `config/cloudinary.js`
- `routes/photos.js`
- `PHOTO-FEATURE-BACKEND.md`
- `QUICK-START-PHOTOS.md`
- `BACKEND-SUMMARY.md`
- `NGO-Photo-API.postman_collection.json`

✅ Updated:

- `server.js` (added photo routes)
- `.env.example` (added Cloudinary vars)
- `.gitignore` (excluded uploads/)

---

## 🔑 Key Points

✅ **Admin-Only Upload** - Regular users CANNOT upload
✅ **Cloud Storage** - Images in Cloudinary (not your server)
✅ **FREE** - 25GB storage, 25GB bandwidth/month
✅ **Secure** - JWT + role check + file validation
✅ **Optimized** - Auto compression, max 1200x1200

---

## 📡 API Quick Reference

| Endpoint                           | Who    | What              |
| ---------------------------------- | ------ | ----------------- |
| `POST /api/photos/upload`          | Admin  | Upload 1 photo    |
| `POST /api/photos/upload-multiple` | Admin  | Upload ≤10 photos |
| `GET /api/photos`                  | Public | List all          |
| `GET /api/photos/:id`              | Public | Get one           |
| `PUT /api/photos/:id`              | Admin  | Update            |
| `DELETE /api/photos/:id`           | Admin  | Delete            |
| `POST /api/photos/:id/like`        | Auth   | Like/unlike       |

---

## ✅ Test Checklist

- [ ] Cloudinary account created
- [ ] `.env` has credentials
- [ ] Server starts
- [ ] Admin uploads photo
- [ ] Photo in Cloudinary dashboard
- [ ] Public can view
- [ ] Non-admin gets 403

---

## 🆘 Quick Troubleshoot

**403 Access Denied?**
→ Use admin token, not regular user

**401 Unauthorized?**
→ Token expired, login again

**No file uploaded?**
→ Field name must be `photo` (singular)

**Image not in Cloudinary?**
→ Check `.env` credentials

---

## 📚 Full Documentation

- `QUICK-START-PHOTOS.md` - Setup guide
- `PHOTO-FEATURE-BACKEND.md` - Full API docs
- `BACKEND-SUMMARY.md` - Implementation details
- `NGO-Photo-API.postman_collection.json` - Test collection

---

## 🎯 Status

**Backend**: 100% Complete ✅
**Ready For**: Frontend Development
**Tech**: Node.js + Cloudinary + MongoDB

---

Last Updated: October 20, 2025
