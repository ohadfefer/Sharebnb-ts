# Sharebnb Backend API

A comprehensive Node.js backend service for Sharebnb - a full-featured Airbnb clone built with modern technologies. This service provides RESTful APIs, real-time WebSocket functionality, MongoDB integration, and advanced workflow automation.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy and configure environment variables
cp .env.example .env
```

3. Start the server:
```bash
npm run dev     # Development mode with hot reload
npm start       # Production mode
```

## 🏗️ Architecture Overview

### Tech Stack
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with native driver
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: Socket.io for WebSocket connections
- **Email**: Nodemailer for transactional emails
- **Workflows**: Upstash Workflows for background processing
- **Logging**: Custom logger service with file output
- **Security**: CORS, cookie-parser, cryptr for encryption

### Project Structure

```
back-sharebnb/
├── api/                    # API routes and business logic
│   ├── auth/              # Authentication & authorization
│   ├── user/              # User management
│   ├── stay/              # Property listings & management
│   ├── order/             # Booking & reservation system
│   ├── review/            # Review & rating system
│   └── workflow/          # Background workflow endpoints
├── config/                # Environment configuration
├── middlewares/           # Express middleware
├── services/              # Core services & utilities
├── workflows/             # Background job workflows
├── utils/                 # Email templates & utilities
└── logs/                  # Application logs
```

## 📡 API Endpoints

### Authentication API (`/api/auth`)
- `POST /signup` - Register new user account
- `POST /login` - User login with JWT token
- `POST /logout` - User logout (token invalidation)

### User Management API (`/api/user`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user account

### Stay Management API (`/api/stay`)
- `GET /` - Get all stays with filtering & pagination
- `GET /:id` - Get stay details by ID
- `POST /` - Create new stay listing
- `PUT /:id` - Update stay listing
- `DELETE /:id` - Delete stay listing
- `POST /:id/msg` - Add message to stay
- `DELETE /:id/msg/:msgId` - Remove message from stay
- `POST /:id/wishlist` - Add stay to wishlist
- `DELETE /:id/wishlist` - Remove stay from wishlist
- `GET /wishlist` - Get user's wishlist stays

### Order Management API (`/api/order`)
- `GET /` - Get orders with filtering
- `GET /:id` - Get order details
- `POST /` - Create new booking order
- `PUT /:id` - Update order status
- `DELETE /:id` - Cancel order

### Review System API (`/api/review`)
- `GET /` - Get all reviews
- `POST /` - Create new review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Workflow API (`/api/workflows`)
- `POST /order-confirmation` - Trigger order confirmation workflow

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,        // Unique username
  password: String,        // Bcrypt hashed password
  fullname: String,        // Display name
  email: String,           // Email address
  imgUrl: String,         // Profile image URL
  isAdmin: Boolean,       // Admin privileges
  createdAt: Date,
  updatedAt: Date
}
```

### Stay Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Property title
  type: String,           // Property type (house, apartment, etc.)
  price: Number,          // Price per night
  summary: String,        // Property description
  capacity: Number,       // Guest capacity
  bedrooms: Number,       // Number of bedrooms
  bathrooms: Number,      // Number of bathrooms
  amenities: [String],    // Available amenities
  imgUrls: [String],      // Property images
  loc: {                  // Location data
    country: String,
    city: String,
    address: String,
    lat: Number,
    lng: Number
  },
  host: ObjectId,         // Reference to User
  msgs: [{                // Messages/notes
    id: String,
    txt: String,
    by: { _id: ObjectId, fullname: String }
  }],
  wishlistUsers: [ObjectId], // Users who wishlisted
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  stayId: ObjectId,       // Reference to Stay
  userId: ObjectId,       // Reference to User (guest)
  hostId: ObjectId,       // Reference to User (host)
  startDate: Date,        // Check-in date
  endDate: Date,          // Check-out date
  guests: Number,          // Number of guests
  totalPrice: Number,      // Total booking cost
  status: String,          // pending, confirmed, cancelled
  createdAt: Date,
  updatedAt: Date
}
```

### Review Collection
```javascript
{
  _id: ObjectId,
  txt: String,            // Review text
  rating: Number,          // Rating (1-5)
  byUserId: ObjectId,      // Reviewer
  aboutUserId: ObjectId,   // User being reviewed
  stayId: ObjectId,        // Related stay
  createdAt: Date
}
```

## 🔒 Authentication & Security

### JWT Implementation
- Stateless authentication using JSON Web Tokens
- Tokens stored in HTTP-only cookies for security
- Automatic token validation via middleware
- Password hashing using bcrypt with salt rounds

### Middleware Stack
- `setupAsyncLocalStorage` - Request context tracking
- `attachLoggedinUser` - User authentication validation
- `requireAuth` - Route protection middleware

### Security Features
- CORS configuration for cross-origin requests
- Input validation and sanitization
- SQL injection prevention (NoSQL)
- XSS protection through proper data handling

## 🔌 Real-time Features

### WebSocket Events (Socket.io)
- `user-watch` - User status updates
- `chat-new-msg` - Real-time messaging
- `review-about-you` - New review notifications
- `review-added` - Review creation events
- `review-removed` - Review deletion events
- `order-updated` - Order status changes

## 📧 Email System

### Automated Email Workflows
- **Order Confirmation**: Automated booking confirmations
- **Welcome Emails**: User registration confirmations
- **Review Notifications**: New review alerts

### Email Templates
- HTML email templates with responsive design
- Dynamic content injection
- Professional branding

## 🔄 Background Workflows

### Upstash Workflows Integration
- **Order Confirmation Workflow**: Handles booking confirmations
- **Email Processing**: Background email sending
- **Data Processing**: Heavy computation tasks

### Workflow Features
- Retry mechanisms for failed operations
- Error handling and logging
- Scalable background processing

## 🛠️ Development

### Environment Configuration
- Development: `config/dev.js`
- Production: `config/prod.js`
- Environment variables via `.env` file

### Logging System
```javascript
import { logger } from './services/logger.service.js'

// Usage examples
logger.info('User logged in successfully')
logger.error('Database connection failed', error)
logger.warn('Rate limit exceeded for user')
logger.debug('Processing request data')
```

### Error Handling Pattern
```javascript
try {
  // Your code here
  const result = await someAsyncOperation()
  return result
} catch (err) {
  logger.error('Operation failed', err)
  throw err
}
```

### Database Connection
```javascript
import { dbService } from './services/db.service.js'

// Get collection
const collection = await dbService.getCollection('stay')

// Perform operations
const stays = await collection.find(criteria).toArray()
```

## 📊 Monitoring & Logging

### Log Levels
- **DEBUG**: Development information
- **INFO**: General application events
- **WARN**: Warning conditions
- **ERROR**: Error events

### Log Storage
- Logs stored in `/logs` directory
- Rotating log files for production
- Structured logging with timestamps

## 🚀 Production Deployment

### Prerequisites
1. MongoDB database instance
2. Email service configuration (SMTP)
3. Upstash account for workflows
4. Environment variables setup

### Deployment Steps
1. Set production environment variables:
```bash
NODE_ENV=production
MONGODB_URI=mongodb://your-db-uri
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
JWT_SECRET=your-jwt-secret
```

2. Build and deploy:
```bash
# Install dependencies
npm install --production

# Start the server
npm start
```

### Production Features
- Static file serving for frontend
- Optimized logging configuration
- Security headers and CORS
- Health check endpoints

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/sharebnb

# Authentication
JWT_SECRET=your-secret-key

# Email
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Server
PORT=3030
NODE_ENV=development

# Upstash (Workflows)
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## 📝 API Documentation

### Request/Response Examples

#### Create Stay
```javascript
POST /api/stay
Content-Type: application/json

{
  "name": "Beautiful Beach House",
  "type": "house",
  "price": 150,
  "summary": "Amazing ocean view property",
  "capacity": 6,
  "bedrooms": 3,
  "bathrooms": 2,
  "amenities": ["wifi", "parking", "pool"],
  "loc": {
    "country": "USA",
    "city": "Miami",
    "address": "123 Ocean Drive",
    "lat": 25.7617,
    "lng": -80.1918
  }
}
```

#### Create Order
```javascript
POST /api/order
Content-Type: application/json

{
  "stayId": "64a1b2c3d4e5f6789abcdef0",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "guests": 2
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - Built with ❤️ for modern fullstack development

---

**Sharebnb Backend** - A production-ready Airbnb clone backend with advanced features including real-time communication, automated workflows, and comprehensive booking management.