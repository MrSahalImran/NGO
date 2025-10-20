# 🚀 Quick Start Guide - Photo Upload Feature

## ✅ Setup Checklist

### 1. Install Dependencies (Already Done ✅)

```bash
npm install cloudinary multer-storage-cloudinary
```

### 2. Get FREE Cloudinary Account (5 minutes)

#### Step-by-step:

1. **Sign up**: https://cloudinary.com/users/register_free

   - Use your email or Google account
   - No credit card required!

2. **Get credentials** (from Dashboard):

   - Cloud Name: `dxxxx` (example)
   - API Key: `123456789012345`
   - API Secret: `aBcDeFgHiJkLmNoPqRsTuVwXyZ`

3. **Add to `.env` file**:
   ```bash
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### 3. Verify Setup

```bash
# Start server
npm run dev

# Should see: "Server running on port 5000"
# MongoDB connected message
```

---

## 🧪 Quick Test (5 minutes)

### Option A: Using Postman/Thunder Client

1. **Import Collection**:

   - File: `NGO-Photo-API.postman_collection.json`
   - Open Postman → Import → Select file

2. **Login as Admin**:

   ```
   POST http://localhost:5000/api/auth/login
   Body:
   {
     "email": "admin@example.com",
     "password": "your_password"
   }
   ```

   **Copy the `token` from response**

3. **Upload Photo**:

   ```
   POST http://localhost:5000/api/photos/upload
   Headers:
     x-auth-token: <paste-token-here>
   Body (form-data):
     photo: <select an image file>
     title: "Test Photo"
     category: "event"
   ```

4. **Check Cloudinary**:
   - Login to Cloudinary dashboard
   - Go to Media Library
   - See your photo in `ngo-photos` folder!

### Option B: Using cURL (Windows PowerShell)

```powershell
# 1. Login (get token)
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{email="admin@example.com"; password="your_password"} | ConvertTo-Json) -ContentType "application/json"
$token = $response.token

# 2. Upload photo
$headers = @{ "x-auth-token" = $token }
$form = @{
    photo = Get-Item -Path "C:\path\to\your\image.jpg"
    title = "Test Photo"
    category = "event"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/photos/upload" -Method POST -Headers $headers -Form $form
```

---

## 📋 Testing Checklist

- [ ] ✅ Cloudinary account created
- [ ] ✅ Credentials added to `.env`
- [ ] ✅ Server starts without errors
- [ ] ✅ Admin can login
- [ ] ✅ Admin can upload photo
- [ ] ✅ Photo appears in Cloudinary dashboard
- [ ] ✅ Photo URL works in browser
- [ ] ✅ Public can view photos (GET /api/photos)
- [ ] ✅ Non-admin CANNOT upload (403 error)

---

## 🎯 What's Working Now

### ✅ Admin Features:

- Upload single photo
- Upload multiple photos (up to 10)
- Edit photo details
- Delete photo (removes from Cloudinary)
- View statistics

### ✅ Public Features:

- View all photos
- Filter by category
- View single photo
- Like photos (authenticated users)

### ✅ Technical:

- Images stored in Cloudinary (not your server!)
- Automatic image optimization
- Size limiting (max 1200x1200)
- File validation (JPEG, PNG, GIF, WEBP)
- Role-based access (admin-only upload)

---

## 🔐 Security Verification

### Test Admin-Only Upload:

1. **Login as regular user** (not admin):

   ```
   POST /api/auth/login
   Body: { "email": "user@example.com", "password": "..." }
   ```

2. **Try to upload**:

   ```
   POST /api/photos/upload
   Headers: x-auth-token: <user-token>
   ```

3. **Expected Result**:
   ```json
   {
     "message": "Access denied. Admin only."
   }
   ```
   ✅ Security working!

---

## 📸 Sample Upload Data

### Good Test Data:

```json
{
  "title": "Community Feeding Program 2025",
  "description": "Served meals to 500+ families in the community",
  "category": "program",
  "tags": "feeding,community,charity,2025"
}
```

### Categories Available:

- `event` - Community events, gatherings
- `program` - Program activities, workshops
- `beneficiary` - Photos of people helped
- `facility` - NGO buildings, resources
- `other` - Miscellaneous

---

## 🐛 Common Issues & Solutions

### Issue: "Access denied. Admin only"

**Solution**: Make sure you're using admin JWT token, not regular user token.

### Issue: Upload returns 401 Unauthorized

**Solution**:

- Token expired - login again
- Wrong token - copy full token from login response

### Issue: "Please upload an image file"

**Solution**:

- Make sure field name is `photo` (not `image` or `file`)
- Use `multipart/form-data` content type

### Issue: Image not showing in Cloudinary

**Solution**:

- Check `.env` has correct credentials
- Verify Cloudinary account is active
- Check cloud name spelling

### Issue: "Only image files are allowed"

**Solution**: Upload only .jpg, .jpeg, .png, .gif, .webp files

---

## 🎉 Success Indicators

✅ Server starts without errors
✅ Can login as admin
✅ Upload returns 201 status
✅ Response includes Cloudinary URL (`https://res.cloudinary.com/...`)
✅ Image appears in Cloudinary Media Library
✅ Image URL opens in browser
✅ Non-admin gets 403 error on upload

---

## 📊 Next Steps

### Backend Complete! ✅

Ready for:

1. Frontend photo gallery UI
2. Admin upload interface
3. Photo management dashboard

---

## 💡 Pro Tips

1. **Test with small images first** (< 1MB) to verify setup
2. **Check Cloudinary dashboard** after each upload
3. **Use descriptive titles** to organize photos
4. **Use categories** to filter photos later
5. **Add tags** for better searchability

---

## 🆘 Need Help?

### Check These Files:

- `PHOTO-FEATURE-BACKEND.md` - Full documentation
- `NGO-Photo-API.postman_collection.json` - API test collection
- `.env.example` - Required environment variables

### Verify Configuration:

```javascript
// Add this temporarily to routes/photos.js for debugging
console.log("Cloudinary configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
  api_key: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌",
});
```

---

**Setup Time**: ~10 minutes
**Status**: Backend 100% Complete ✅
**Ready For**: Frontend Development

Last Updated: October 20, 2025
