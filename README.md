# NGO Website

A comprehensive full-stack web application for NGO operations including volunteer registration, donation management, and administrative dashboard.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

The Hope Foundation NGO Website is a modern, responsive web application designed to facilitate NGO operations including:

- Public information display about the organization
- Volunteer registration system
- Online donation processing
- Administrative dashboard for management
- User authentication and authorization

### Project Goals

- **Transparency**: Provide clear information about NGO activities and impact
- **Engagement**: Enable easy volunteer registration and participation
- **Fundraising**: Facilitate secure online donations
- **Management**: Offer administrative tools for efficient operations
- **Accessibility**: Ensure mobile-responsive and user-friendly interface

## ✨ Features

### Public Website

- **Home Page**: Organization information, mission, vision, and impact statistics
- **About Section**: Detailed organizational background and history
- **Programs**: Showcase of NGO initiatives and projects
- **Contact Information**: Multiple contact methods and location details
- **News & Updates**: Latest organizational news and achievements
- **Testimonials**: Success stories and community feedback

### Volunteer Management

- **Registration Form**: Comprehensive volunteer application system
- **Skill-based Matching**: Categorize volunteers by skills and interests
- **Status Tracking**: Monitor application and approval status
- **Communication**: Email notifications for application updates

### Donation System

- **Secure Payments**: Stripe integration for credit card processing
- **Multiple Amount Options**: Preset and custom donation amounts
- **Recurring Donations**: Monthly/yearly giving options
- **Receipt Generation**: Automatic email receipts for tax purposes
- **Campaign Tracking**: Monitor fundraising campaign performance

### Administrative Dashboard

- **User Management**: View and manage registered users
- **Volunteer Applications**: Review, approve, or reject applications
- **Donation Tracking**: Monitor all donations and payment history
- **Analytics**: Generate reports on key metrics
- **Content Management**: Update organization information and news

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and user role differentiation
- **Password Encryption**: bcrypt hashing for secure password storage
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side data validation and sanitization

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js v18+
- **Framework**: Express.js v4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcryptjs
- **Payment Processing**: Stripe API integration
- **Security**: Helmet.js, CORS, express-validator
- **Environment**: dotenv for configuration management

### Frontend

- **Framework**: React.js v19.1+
- **Routing**: React Router DOM v7.9+
- **UI Library**: React Bootstrap v2.10+ with Bootstrap v5.3+
- **Icons**: React Icons (FontAwesome) v5.5+
- **HTTP Client**: Axios v1.12+
- **Notifications**: React Toastify v11.0+
- **Payment UI**: Stripe React components
- **Build Tool**: Vite v7.1+ (Faster development and builds with HMR)
- **TypeScript**: Full TypeScript support with Vite

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Code Formatting**: ESLint (React App configuration)
- **Development Server**: Vite Dev Server with Hot Module Replacement (HMR)
- **API Testing**: Built-in REST endpoints

## 🏗️ System Architecture

### Application Structure

```
NGO Website/
├── server.js                 # Main Express server
├── package.json              # Backend dependencies
├── .env                      # Environment variables
├── seedAdmin.js              # Admin user seeding script
├── models/                   # MongoDB schemas
│   ├── User.js              # User authentication model
│   ├── Registration.js      # Volunteer registration model
│   └── Payment.js           # Donation payment model
├── routes/                   # API endpoints
│   ├── auth.js              # Authentication routes
│   ├── registrations.js     # Volunteer management
│   ├── payments.js          # Donation processing
│   ├── admin.js             # Administrative functions
│   └── ngo.js               # Public information API
├── middleware/               # Custom middleware
│   └── auth.js              # JWT authentication middleware
└── client/                   # React frontend
    ├── package.json          # Frontend dependencies
    ├── public/               # Static assets
    └── src/                  # React source code
        ├── components/       # Reusable components
        ├── pages/            # Page components
        ├── context/          # React context providers
        └── App.js            # Main application component
```

### Database Architecture

The application uses MongoDB with three main collections:

1. **Users Collection**: Authentication and user management
2. **Registrations Collection**: Volunteer applications and status
3. **Payments Collection**: Donation records and transaction history

### API Architecture

RESTful API design with the following endpoint categories:

- `/api/auth/*` - Authentication and user management
- `/api/registrations/*` - Volunteer registration operations
- `/api/payments/*` - Donation processing endpoints
- `/api/admin/*` - Administrative functions
- `/api/ngo/*` - Public organization information

## 📦 Installation & Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Stripe Account**: For payment processing (test/live keys)
- **Git**: For version control

### Step-by-Step Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd NGO
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ngo_website
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   NODE_ENV=development
   ```

5. **Database Setup**

   ```bash
   # Start MongoDB service (if running locally)
   # For Windows:
   net start MongoDB

   # Create admin user
   node seedAdmin.js
   ```

6. **Start the Application**

   **Terminal 1 - Backend Server:**

   ```bash
   npm start
   # Server will run on http://localhost:5000
   ```

   **Terminal 2 - Frontend Development Server:**

   ```bash
   cd client
   npm run dev
   # Vite React app will run on http://localhost:3000
   ```

### Verification Steps

1. Visit `http://localhost:3000` - Frontend should load
2. Check `http://localhost:5000/api/ngo/info` - API should respond
3. Login with admin credentials (see configuration section)
4. Test registration and donation forms

## ⚙️ Configuration

### Environment Variables

| Variable                 | Description               | Required | Default                     |
| ------------------------ | ------------------------- | -------- | --------------------------- |
| `PORT`                   | Backend server port       | No       | 5000                        |
| `MONGODB_URI`            | MongoDB connection string | Yes      | localhost:27017/ngo_website |
| `JWT_SECRET`             | Secret key for JWT tokens | Yes      | -                           |
| `STRIPE_SECRET_KEY`      | Stripe API secret key     | Yes      | -                           |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key    | Yes      | -                           |
| `NODE_ENV`               | Environment mode          | No       | development                 |

### Default Admin Account

After running `node seedAdmin.js`, the following admin account is created:

- **Email**: admin@vridhashram.org
- **Password**: admin123
- **Role**: admin

**⚠️ Important**: Change the default admin password after first login in production.

### Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Obtain test API keys from Stripe Dashboard
3. Add keys to `.env` file
4. For production, replace with live keys

### Vite Configuration

The project has been migrated from Create React App to Vite for improved performance:

**Benefits of Vite:**

- ⚡ **Faster Cold Start**: Near-instant server startup
- 🔥 **Hot Module Replacement (HMR)**: Lightning-fast updates during development
- 📦 **Optimized Builds**: Rollup-based production builds
- 🎯 **Native ES Modules**: Modern JavaScript module system
- 💎 **TypeScript Support**: Built-in TypeScript compilation

**Configuration (`vite.config.ts`):**

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

### MongoDB Configuration Options

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/ngo_website
```

**MongoDB Atlas (Cloud):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngo_website
```

## 📖 Usage Guide

### For Website Visitors

1. **Browsing Information**

   - Visit homepage for organization overview
   - Navigate through About, Programs, Contact sections
   - View latest news and testimonials

2. **Volunteer Registration**

   - Click "Join as Volunteer" or navigate to /registration
   - Fill out the comprehensive registration form
   - Submit application for admin review
   - Receive email confirmation upon submission

3. **Making Donations**
   - Navigate to /donation or click "Donate Now"
   - Select predefined amounts or enter custom amount
   - Fill in payment details using Stripe form
   - Receive payment confirmation and receipt

### For Administrators

1. **Accessing Admin Dashboard**

   - Login at /login with admin credentials
   - Navigate to /admin/dashboard after authentication
   - Access restricted to users with 'admin' role

2. **Managing Volunteers**

   - View all volunteer applications in dashboard
   - Review application details and qualifications
   - Approve or reject applications with status updates
   - Filter and search through applications

3. **Tracking Donations**

   - Monitor all donation transactions
   - View payment details and donor information
   - Generate reports on fundraising performance
   - Track campaign progress and goals

4. **Content Management**
   - Update organization information through API
   - Manage news articles and announcements
   - Moderate testimonials and feedback

### User Account Management

1. **Registration Process**

   - New users can register at /register
   - Email verification (if implemented)
   - Profile completion and preferences

2. **Authentication Flow**
   - JWT tokens stored in localStorage
   - Automatic token refresh handling
   - Role-based route protection

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login

Authenticate existing user.

**Request Body:**

```json
{
  "email": "admin@hopefoundation.org",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@vridhashram.org",
    "role": "admin"
  }
}
```

### Volunteer Registration Endpoints

#### POST /api/registrations

Submit volunteer registration.

**Request Body:**

```json
{
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "ST",
      "zipCode": "12345",
      "country": "USA"
    }
  },
  "availability": {
    "preferredDays": ["Monday", "Wednesday", "Friday"],
    "timeCommitment": "4-6 hours/week",
    "startDate": "2024-02-01"
  },
  "skills": ["Teaching", "Healthcare", "Technology"],
  "interests": ["Education", "Community Development"],
  "experience": "Previous volunteer experience with local charities...",
  "motivation": "I want to contribute to meaningful causes..."
}
```

#### GET /api/registrations (Admin only)

Retrieve all volunteer registrations.

**Response:**

```json
[
  {
    "_id": "registration_id",
    "personalInfo": {
      /* ... */
    },
    "availability": {
      /* ... */
    },
    "skills": [],
    "interests": [],
    "status": "pending",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### PUT /api/registrations/:id/status (Admin only)

Update registration status.

**Request Body:**

```json
{
  "status": "approved",
  "adminNotes": "Great candidate with relevant experience"
}
```

### Payment Endpoints

#### POST /api/payments/create-payment-intent

Create Stripe payment intent for donations.

**Request Body:**

```json
{
  "amount": 5000,
  "currency": "usd",
  "donorInfo": {
    "name": "John Donor",
    "email": "john@example.com",
    "message": "Keep up the great work!"
  }
}
```

**Response:**

```json
{
  "clientSecret": "pi_1234567890_secret_abcdef",
  "paymentIntentId": "pi_1234567890"
}
```

#### POST /api/payments/confirm

Confirm successful payment.

**Request Body:**

```json
{
  "paymentIntentId": "pi_1234567890",
  "amount": 5000,
  "donorInfo": {
    "name": "John Donor",
    "email": "john@example.com",
    "message": "Keep up the great work!"
  }
}
```

### NGO Information Endpoints

#### GET /api/ngo/info

Retrieve organization information.

**Response:**

```json
{
  "name": "Hope Foundation",
  "mission": "Empowering communities through education...",
  "vision": "A world where every individual has access...",
  "programs": [
    {
      "id": 1,
      "title": "Education for All",
      "description": "Providing quality education...",
      "image": "/images/education.jpg"
    }
  ],
  "impact": {
    "beneficiaries": 10000,
    "projects": 150,
    "volunteers": 500,
    "yearsActive": 13
  },
  "contact": {
    /* ... */
  }
}
```

#### GET /api/ngo/testimonials

Retrieve community testimonials.

#### GET /api/ngo/news

Retrieve latest news and updates.

### Admin Endpoints

#### GET /api/admin/dashboard (Admin only)

Retrieve dashboard statistics and summary.

**Response:**

```json
{
  "stats": {
    "totalVolunteers": 45,
    "pendingApplications": 12,
    "totalDonations": 125000,
    "monthlyDonations": 15000
  },
  "recentRegistrations": [],
  "recentPayments": []
}
```

## 💾 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Registrations Collection

```javascript
{
  _id: ObjectId,
  personalInfo: {
    firstName: String (required),
    lastName: String (required),
    email: String (required),
    phone: String (required),
    dateOfBirth: Date (required),
    address: {
      street: String (required),
      city: String (required),
      state: String (required),
      zipCode: String (required),
      country: String (required)
    }
  },
  availability: {
    preferredDays: [String] (required),
    timeCommitment: String (required),
    startDate: Date (required)
  },
  skills: [String] (required),
  interests: [String] (required),
  experience: String,
  motivation: String,
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  adminNotes: String,
  submittedAt: Date (default: Date.now),
  reviewedAt: Date,
  reviewedBy: ObjectId (ref: 'User')
}
```

### Payments Collection

```javascript
{
  _id: ObjectId,
  stripePaymentIntentId: String (required, unique),
  amount: Number (required, min: 100), // Amount in cents
  currency: String (default: 'usd'),
  status: String (enum: ['pending', 'succeeded', 'failed'], default: 'pending'),
  donorInfo: {
    name: String (required),
    email: String (required),
    message: String
  },
  paymentMethod: String,
  receiptUrl: String,
  createdAt: Date (default: Date.now),
  completedAt: Date
}
```

## 🔒 Security Features

### Authentication Security

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-based Authorization**: Middleware for protecting admin-only routes
- **Input Validation**: Server-side validation using express-validator

### Data Protection

- **CORS Configuration**: Controlled cross-origin resource sharing
- **Helmet.js**: Security headers for protection against common vulnerabilities
- **MongoDB Injection Prevention**: Mongoose schema validation
- **Environment Variables**: Sensitive data stored in .env files

### Payment Security

- **Stripe Integration**: PCI-compliant payment processing
- **No Card Storage**: Card details handled entirely by Stripe
- **Webhook Verification**: Stripe webhook signature verification
- **Amount Validation**: Server-side donation amount verification

### Best Practices Implemented

- **HTTPS Ready**: SSL/TLS configuration for production
- **Rate Limiting**: API request rate limiting (can be implemented)
- **Audit Logging**: User action logging for security monitoring
- **Session Management**: Secure JWT token handling

## 🚀 Deployment

### Production Environment Setup

#### Backend Deployment (Node.js)

1. **Server Requirements**

   - Node.js 18+ environment
   - MongoDB database access
   - SSL certificate for HTTPS
   - Environment variable management

2. **Environment Configuration**

   ```env
   NODE_ENV=production
   PORT=80
   MONGODB_URI=mongodb+srv://production-cluster-url
   JWT_SECRET=production_jwt_secret_very_long_and_secure
   STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   ```

3. **Build and Deploy Commands**

   ```bash
   # Install production dependencies
   npm ci --only=production

   # Start with process manager
   pm2 start server.js --name "ngo-backend"
   ```

#### Frontend Deployment (React)

1. **Build Production Bundle**

   ```bash
   cd client
   npm run build
   ```

2. **Deploy Options**

   - **Static Hosting**: Netlify, Vercel, GitHub Pages
   - **CDN**: Amazon CloudFront, Cloudflare
   - **Web Server**: Nginx, Apache with build folder

3. **Environment Variables for Frontend**
   Create `.env.production` in client folder:
   ```env
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   REACT_APP_API_URL=https://your-api-domain.com
   ```

#### Database Deployment

**MongoDB Atlas (Recommended)**

1. Create MongoDB Atlas cluster
2. Configure network access and security
3. Update MONGODB_URI in production environment
4. Set up automated backups

**Self-hosted MongoDB**

1. Install MongoDB on production server
2. Configure replica sets for high availability
3. Set up regular backup procedures
4. Implement monitoring and alerting

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate installed
- [ ] Stripe webhooks configured
- [ ] Admin account created
- [ ] API endpoints tested
- [ ] Frontend build deployed
- [ ] Domain DNS configured
- [ ] Monitoring setup
- [ ] Backup procedures implemented

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Frontend Issues

**Issue**: React app shows 404 errors for API calls
**Solution**:

- Verify proxy configuration in `client/package.json`
- Ensure backend server is running on port 5000
- Check if both servers are started correctly

**Issue**: Compilation errors with FontAwesome icons
**Solution**:

- Verify icon names exist in react-icons/fa
- Check import statements for correct icon names
- Restart development server after fixing imports

**Issue**: Stripe payment form not loading
**Solution**:

- Verify Stripe publishable key in environment
- Check browser console for JavaScript errors
- Ensure Stripe dependencies are properly installed

#### Backend Issues

**Issue**: MongoDB connection failed
**Solution**:

- Verify MongoDB service is running
- Check MONGODB_URI format and credentials
- Test database connectivity separately

**Issue**: JWT authentication errors
**Solution**:

- Verify JWT_SECRET is set in environment
- Check token expiration settings
- Clear browser localStorage and re-login

**Issue**: Stripe payment processing fails
**Solution**:

- Verify Stripe secret key configuration
- Check webhook endpoint configuration
- Review Stripe dashboard for error details

#### General Development Issues

**Issue**: CORS errors in development
**Solution**:

- Verify CORS configuration in server.js
- Check if frontend and backend ports are correct
- Ensure proxy configuration is properly set

**Issue**: Environment variables not loading
**Solution**:

- Verify .env file location and format
- Check for typos in variable names
- Restart servers after environment changes

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
DEBUG=true
```

### Performance Optimization

1. **Frontend Optimization**

   - Implement code splitting with React.lazy()
   - Optimize image sizes and formats
   - Use React.memo for expensive components
   - Implement proper error boundaries

2. **Backend Optimization**

   - Add database indexing for frequent queries
   - Implement API response caching
   - Use connection pooling for MongoDB
   - Add request rate limiting

3. **Database Optimization**
   - Create indexes on frequently queried fields
   - Implement aggregation pipelines for complex queries
   - Monitor query performance
   - Set up database connection pooling

## 🤝 Contributing

### Development Guidelines

1. **Code Standards**

   - Follow ESLint configuration
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Maintain consistent formatting

2. **Git Workflow**

   - Create feature branches for new development
   - Write descriptive commit messages
   - Submit pull requests for code review
   - Test thoroughly before merging

3. **Testing Requirements**
   - Write unit tests for new functions
   - Test API endpoints with various inputs
   - Verify responsive design on mobile devices
   - Check cross-browser compatibility

### Feature Development Process

1. **Planning Phase**

   - Document feature requirements
   - Design database schema changes
   - Plan API endpoint modifications
   - Create UI/UX mockups

2. **Implementation Phase**

   - Create backend models and routes
   - Implement frontend components
   - Add proper error handling
   - Write comprehensive tests

3. **Review Phase**
   - Code review by team members
   - Security vulnerability assessment
   - Performance impact analysis
   - Documentation updates

### Bug Reporting

When reporting bugs, include:

- Detailed steps to reproduce
- Expected vs actual behavior
- Browser/environment information
- Error messages and stack traces
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### Third-party Licenses

- **React**: MIT License
- **Express.js**: MIT License
- **MongoDB**: Server Side Public License (SSPL)
- **Stripe**: Commercial License (API usage)
- **Bootstrap**: MIT License
- **FontAwesome**: Font Awesome Free License

## 📞 Support and Maintenance

### Contact Information

- **Technical Support**: support@vridhashram.org
- **General Inquiries**: info@vridhashram.org
- **Emergency Contact**: +9185454384384

### Maintenance Schedule

- **Regular Updates**: Monthly security patches
- **Feature Updates**: Quarterly releases
- **Database Backups**: Daily automated backups
- **Performance Monitoring**: Continuous monitoring

### Version History

- **v1.0.0** (Current): Initial release with core functionality
- **Future Releases**: Enhanced reporting, mobile app, volunteer portal

---

**Last Updated**: September 29, 2025
**Version**: 1.0.0
**Maintained By**: Vridh Ashram Development Team

## Features

### Public Features

- **Home Page**: NGO information, programs, testimonials, and news
- **About Page**: Mission, vision, history, and contact information
- **Programs Page**: Detailed information about NGO programs and initiatives
- **Contact Page**: Contact form and organization details
- **Volunteer Registration**: Complete volunteer registration form with interests and emergency contact
- **Donation System**: Multi-step donation process with Stripe integration
- **User Authentication**: Login/register system for users

### Admin Features

- **Admin Dashboard**: Overview statistics and recent activities
- **Registration Management**: View, approve, or reject volunteer registrations
- **Donation Management**: Track and view all donations with detailed information
- **User Management**: View all registered users

## Technology Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Stripe** for payment processing
- **bcryptjs** for password hashing
- **Helmet** for security

### Frontend

- **React.js** with React Router
- **React Bootstrap** for UI components
- **Stripe React** for payment forms
- **Axios** for API calls
- **React Toastify** for notifications

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Stripe account (for payment processing)

### Backend Setup

1. **Clone and navigate to the project**:

   ```bash
   cd NGO
   ```

2. **Install backend dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ngo_website
     JWT_SECRET=your_secure_jwt_secret_here
     STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password
     ```

4. **Start MongoDB** (if using local instance):

   ```bash
   mongod
   ```

5. **Seed the database with admin user**:

   ```bash
   node seedAdmin.js
   ```

6. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**:

   ```bash
   cd client
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Update Stripe configuration**:

   - Open `src/pages/Donation.js`
   - Replace `'pk_test_your_stripe_publishable_key'` with your actual Stripe publishable key

4. **Start the frontend development server**:
   ```bash
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin Credentials

After running the seed script, you can log in as admin with:

- **Email**: admin@hopefoundation.org
- **Password**: admin123

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Volunteer Registrations

- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Create new registration
- `GET /api/registrations/:id` - Get specific registration
- `PATCH /api/registrations/:id/status` - Update registration status

### Payments

- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/stats/summary` - Get payment statistics

### Admin

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

### NGO Information

- `GET /api/ngo/info` - Get NGO information
- `GET /api/ngo/testimonials` - Get testimonials
- `GET /api/ngo/news` - Get latest news

## Project Structure

```
NGO/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── middleware/             # Custom middleware
├── server.js              # Express server
├── seedAdmin.js           # Admin user seeding script
└── package.json
```

## Deployment

### Backend Deployment (Heroku example)

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Frontend Deployment (Netlify example)

1. Build the React app: `npm run build`
2. Deploy the build folder to Netlify
3. Update API endpoints to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## 🚀 TypeScript & Vite Migration (October 2025)

### What Changed

The project has been successfully migrated from Create React App to Vite with full TypeScript support for improved development experience and type safety:

**Performance Improvements:**

- ⚡ **50% Faster Startup**: Vite cold start vs CRA
- 🔥 **Instant HMR**: Hot Module Replacement in milliseconds
- 📦 **Smaller Bundles**: Optimized production builds with Rollup
- 🎯 **Modern Tooling**: Native ES modules and esbuild

**TypeScript Benefits:**

- 🔒 **Type Safety**: Compile-time error detection and prevention
- 📝 **Better IntelliSense**: Enhanced IDE support with autocomplete
- 🐛 **Fewer Runtime Errors**: Catch bugs before they reach production
- 📚 **Self-Documenting Code**: Types serve as inline documentation
- 🔄 **Refactoring Safety**: Confident code changes with type checking

**Developer Experience:**

- **Faster Development**: Near-instant feedback during development
- **TypeScript Ready**: Full TypeScript support with strict type checking
- **Better Error Messages**: Clear and actionable error reporting
- **Modern JavaScript**: ESM modules and top-level await support

**Migration Notes:**

- All React components converted to TypeScript (.tsx files)
- Comprehensive type definitions in `src/types/index.ts`
- Proxy configuration moved to `vite.config.ts`
- Development command changed from `npm start` to `npm run dev`
- Build output directory is now `dist/` instead of `build/`
- Strict TypeScript configuration with type checking

**Type Definitions Added:**

- `User` & `AuthContextType` - Authentication and user management
- `NGOInfo`, `Program`, `Impact` - Organization information structures
- `Registration`, `Payment` - Form data and database models
- `DashboardStats` - Administrative analytics types
- `ApiResponse<T>` - Generic API response wrapper
- Component prop interfaces for type-safe React components

### Commands Update

```bash
# Old CRA commands:
npm start          # Development server
npm run build      # Production build

# New Vite commands:
npm run dev        # Development server (faster)
npm run build      # Production build (optimized)
npm run preview    # Preview production build locally
```

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Last Updated**: October 1, 2025  
**Version**: 2.0.0 (TypeScript + Vite Migration)  
**Maintained By**: Hope Foundation Development Team
