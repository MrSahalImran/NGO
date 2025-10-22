# Donation System Setup Guide

This guide will help you set up the complete donation system with 80G certificate workflow.

## Features Implemented

✅ Public donation page with bank details & UPI QR code  
✅ Conditional 80G certificate form with checkbox  
✅ Payment proof upload (Cloudinary)  
✅ Automatic email notifications to admin on new donations  
✅ Admin donations dashboard with approve/reject functionality  
✅ Automatic receipt number generation (format: 80G/2025/0001)  
✅ Email confirmation to donors after submission  
✅ Email notification to donors on approval/rejection  
✅ Status tracking: pending → verified → certificate_sent

## Email Setup (Gmail)

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Find **2-Step Verification** and enable it
4. Follow the prompts to set up 2-Step Verification

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to **Security**
2. Scroll down to **2-Step Verification** section
3. Click on **App passwords** (you might need to sign in again)
4. Select app: **Mail**
5. Select device: **Other (Custom name)**
6. Enter name: **NGO Website**
7. Click **Generate**
8. Copy the 16-character password (without spaces)

### Step 3: Update .env File

Open your `.env` file in the root directory and update these values:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-character app password from Step 2
ADMIN_EMAIL=admin@virdhashram.org  # Email where admin notifications will be sent
# Optional SMTP overrides (defaults work for Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

**Important:**

- `EMAIL_USER` = Your Gmail address that will send the emails
- `EMAIL_PASS` = The 16-character app password (NOT your regular Gmail password)
- `ADMIN_EMAIL` = Email address where donation notifications will be received
- Ensure `EMAIL_USER` matches the Google account where you created the App Password

### Example:

```env
EMAIL_USER=virdhashram.contact@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=admin@virdhashram.org
```

## Testing the System

### 1. Start the Backend Server

```bash
npm start
```

Server will start on: http://localhost:5000

### 2. Start the Frontend

```bash
cd client
npm run dev
```

Frontend will start on: http://localhost:5173

### 3. Test Donation Flow

**Public Donation Submission:**

1. Go to: http://localhost:5173/donation
2. Check the "I want a Donation Receipt and 80G Certificate" checkbox
3. Fill in all required fields:
   - Full Name
   - Email Address
   - Amount Donated
   - Transaction ID
   - Payment Proof (upload screenshot)
4. Click "Submit for 80G Certificate"
5. Check your email (both admin and donor should receive emails)

**Admin Dashboard:**

1. Login to admin panel: http://localhost:5173/login
2. Go to: http://localhost:5173/admin/donations
3. You should see the donation in "Pending" status
4. Click "View" to see details
5. Click "Verify & Send Certificate" to approve
   - Receipt number will be auto-generated (e.g., 80G/2025/0001)
   - Donor will receive email with certificate details
6. Or click "Reject" to reject with a reason

## Email Templates

### 1. Admin Notification Email (on new donation)

**Subject:** New Donation Received - ₹[amount]

**Content:**

- Donor Name
- Email
- Phone
- Amount
- Transaction ID
- Message
- Link to payment proof
- Submission Date

### 2. Donor Confirmation Email (on submission)

**Subject:** Donation Received - Virdh Ashram

**Content:**

- Thank you message
- Donation amount
- Transaction ID
- Information about verification process
- Timeline: 2-3 business days

### 3. Certificate Email (on approval)

**Subject:** 80G Tax Exemption Certificate - Virdh Ashram

**Content:**

- Thank you message
- Receipt Number
- Donation Amount
- Transaction ID
- Date
- Section 80G information
- PDF certificate (coming soon)

### 4. Rejection Email (on rejection)

**Subject:** Donation Verification Update - Virdh Ashram

**Content:**

- Rejection notification
- Reason for rejection
- Contact information
- Transaction ID for reference

## API Endpoints

### Public Endpoints

**POST /api/donations/submit**

- Accepts: multipart/form-data
- Fields: donorName, email, phone, amount, transactionId, message, paymentProof (file)
- Returns: Success message and donation ID

### Admin Endpoints (Requires Authentication)

**GET /api/donations**

- Query: ?status=pending|verified|rejected|certificate_sent
- Returns: Array of donations

**GET /api/donations/:id**

- Returns: Single donation details

**PUT /api/donations/:id/verify**

- Approves donation, generates receipt number, sends certificate email
- Returns: Updated donation with receipt number

**PUT /api/donations/:id/reject**

- Body: { reason: "string" }
- Rejects donation and sends rejection email
- Returns: Updated donation

## Database Schema

**Donation Model:**

```javascript
{
  donorName: String (required)
  email: String (required)
  phone: String
  amount: Number (required)
  transactionId: String (required)
  paymentProof: {
    url: String (Cloudinary URL)
    cloudinaryId: String
  }
  message: String
  status: Enum ['pending', 'verified', 'rejected', 'certificate_sent']
  receiptNumber: String (auto-generated: 80G/YYYY/0001)
  certificateUrl: String (for future PDF storage)
  rejectionReason: String
  verifiedBy: ObjectId (admin user)
  verifiedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

## Next Steps (To be implemented)

1. **PDF Certificate Generation**

   - Install `pdfkit` package
   - Create certificate template with NGO logo
   - Include receipt number, donor details, amount
   - Upload PDF to Cloudinary
   - Attach PDF to email

2. **Enhanced Admin Dashboard**

   - Add search and filter options
   - Export donations to Excel
   - Print donation receipts
   - Bulk actions

3. **Donor Portal**
   - Allow donors to track their donation status
   - Download certificate PDF
   - View donation history

## Troubleshooting

### Emails not sending?

1. **Check .env file:**

   - Verify EMAIL_USER is correct Gmail address
   - Verify EMAIL_PASS is the 16-character app password (not regular password)
   - No spaces in the app password in .env file

2. **Check Gmail account:**

   - 2-Step Verification is enabled
   - App password is generated correctly
   - Account is not locked or restricted

3. **Check server logs:**

   - Look for errors in terminal where backend is running
   - Common errors: "Invalid login", "App password required"

4. **Test with Gmail SMTP:**

   ```javascript
   // Test email sending
   const nodemailer = require("nodemailer");

   const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS,
     },
   });

   transporter.sendMail(
     {
       from: "your_email@gmail.com",
       to: "test@example.com",
       subject: "Test Email",
       text: "This is a test email",
     },
     (error, info) => {
       if (error) {
         console.log("Error:", error);
       } else {
         console.log("Email sent:", info.response);
       }
     }
   );
   ```

### Uploads not working?

1. **Check Cloudinary credentials in .env:**

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Check Cloudinary free tier limits:**
   - 25GB storage
   - 25GB bandwidth per month
   - If exceeded, upgrade or optimize images

### CORS errors?

1. **Ensure backend is running on correct port (5000)**
2. **Check client/.env has correct API URL:**
   ```env
   VITE_API_URL=http://192.168.29.33:5000
   ```

## Security Considerations

1. **Never commit .env file to Git**

   - Already in .gitignore
   - Keep credentials secure

2. **Use environment variables in production**

   - Never hardcode credentials
   - Use secure hosting environment variables

3. **Validate file uploads**

   - Only allow images (jpg, png, pdf)
   - Limit file size (configured in multer)
   - Scan for malware in production

4. **Rate limiting**
   - Add rate limiting to prevent spam
   - Use `express-rate-limit` package

## Support

If you encounter any issues:

1. Check server logs (terminal running `npm start`)
2. Check browser console (F12)
3. Check network tab for failed requests
4. Verify all environment variables are set correctly

---

**System Status:**
✅ Backend API - Complete  
✅ Frontend Pages - Complete  
✅ Email Notifications - Complete  
✅ Admin Dashboard - Complete  
✅ File Uploads - Complete  
⏳ PDF Certificate Generation - Pending  
⏳ Email Attachments - Pending

Last Updated: January 2025
