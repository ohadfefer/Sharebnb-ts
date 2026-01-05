# Sharebnb Frontend

A modern, responsive React application for Sharebnb - a full-featured Airbnb clone built with cutting-edge frontend technologies. This application provides a complete user experience for property booking, management, and social features.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev          # Development mode
npm run dev:local    # Local backend mode
npm run dev:remote   # Remote backend mode
```

3. Build for production:
```bash
npm run build        # Production build
npm run preview      # Preview production build
```

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: React 18 with functional components
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router v6 with nested routes
- **State Management**: Redux with Redux Toolkit
- **Styling**: CSS Modules with SCSS preprocessing
- **UI Components**: Material-UI (MUI) components
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Date Handling**: Day.js and React Day Picker
- **HTTP Client**: Axios for API communication
- **Real-time**: Socket.io client for WebSocket connections
- **Icons**: React Icons library
- **Utilities**: Lodash, clsx for utility functions

### Project Structure

```
front-sharebnb/
├── src/
│   ├── assets/              # Static assets
│   │   ├── imgs/           # Images and media
│   │   ├── logo/           # Brand assets
│   │   ├── styles/         # SCSS modules and global styles
│   │   └── videos/         # Video assets
│   ├── cmps/               # Reusable components
│   │   ├── AppHeader.jsx   # Navigation header
│   │   ├── AppFooter.jsx   # Footer component
│   │   ├── StayList.jsx    # Property listings
│   │   ├── StayFilter.jsx  # Search and filters
│   │   ├── ReviewList.jsx  # Review system
│   │   └── ...             # Other components
│   ├── pages/              # Route components
│   │   ├── StayExplore.jsx # Property exploration
│   │   ├── StayDetails.jsx # Property details
│   │   ├── StayOrder.jsx   # Booking process
│   │   ├── TripIndex.jsx   # Trip management
│   │   └── ...             # Other pages
│   ├── services/           # API and utility services
│   │   ├── stay/          # Stay-related API calls
│   │   ├── user/          # User management
│   │   ├── order/         # Booking system
│   │   └── ...            # Other services
│   ├── store/             # Redux state management
│   │   ├── actions/       # Action creators
│   │   └── reducers/      # State reducers
│   ├── customHooks/       # Custom React hooks
│   └── RootCmp.jsx        # Main app component
├── public/                # Public assets
└── vite.config.js         # Vite configuration
```

## 🎨 Core Features

### Property Management
- **Property Listings**: Browse and search properties with advanced filters
- **Property Details**: Comprehensive property information with image galleries
- **Property Creation**: Host tools for creating and managing listings
- **Wishlist**: Save favorite properties for later
- **Map Integration**: Interactive maps showing property locations

### Booking System
- **Date Selection**: Flexible date picker with availability checking
- **Guest Management**: Select number of guests and guest types
- **Pricing Calculator**: Real-time price calculation with fees
- **Order Confirmation**: Complete booking flow with email confirmations
- **Reservation Management**: View and manage bookings

### User Experience
- **Authentication**: Login/signup with JWT authentication
- **User Profiles**: Comprehensive user profile management
- **Review System**: Rate and review stays and hosts
- **Real-time Chat**: Instant messaging between guests and hosts
- **Responsive Design**: Mobile-first responsive design

### Host Dashboard
- **Listing Management**: Create, edit, and manage property listings
- **Reservation Overview**: View and manage incoming bookings
- **Analytics**: Performance metrics and insights
- **Admin Panel**: Administrative tools for platform management

## 🎯 Pages & Routes

### Public Routes
- `/` - Homepage (redirects to `/stay`)
- `/stay` - Property listings and search
- `/explore` - Map-based property exploration
- `/stay/:stayId` - Individual property details
- `/stay/:stayId/order` - Booking process
- `/about` - About page with nested routes
  - `/about/team` - Team information
  - `/about/vision` - Company vision

### Authenticated Routes
- `/auth/login` - User login
- `/auth/signup` - User registration
- `/user/:id` - User profile
- `/trips` - User's trip history
- `/wishlists` - Saved properties
- `/order/:orderId/confirmation` - Booking confirmation

### Host Routes
- `/hosting/listings` - Create new listing
- `/hosting/listings/edit/:stayId` - Edit existing listing
- `/dashboard/reservations` - Manage reservations
- `/dashboard/listings` - Manage listings

### Admin Routes
- `/admin` - Administrative dashboard

## 🔄 State Management

### Redux Store Structure
```javascript
{
  stayModule: {
    stays: [],           // Property listings
    filterBy: {},        // Search filters
    isLoading: false,    // Loading states
    selectedStay: null   // Currently viewed property
  },
  userModule: {
    user: null,          // Current user
    users: [],           // All users (admin)
    isLoading: false
  },
  orderModule: {
    orders: [],          // User orders
    isLoading: false
  },
  reviewModule: {
    reviews: [],         // Reviews
    isLoading: false
  },
  systemModule: {
    userMsg: null,       // Toast messages
    socket: null         // WebSocket connection
  }
}
```

### Action Examples
```javascript
// Stay actions
dispatch(loadStays())                    // Load all stays
dispatch(setFilter({ city: 'Miami' }))   // Set search filters
dispatch(addStay(stayData))              // Add new stay
dispatch(updateStay(stayId, updates))    // Update stay

// User actions
dispatch(login(credentials))             // User login
dispatch(signup(userData))               // User registration
dispatch(updateUser(userId, updates))    // Update profile

// Order actions
dispatch(addOrder(orderData))             // Create booking
dispatch(loadOrders())                   // Load user orders
```

## 🎨 Styling System

### SCSS Architecture
```scss
// Global styles
@import "setup/var";           // CSS variables
@import "setup/typography";    // Font definitions
@import "basics/helpers";      // Utility classes
@import "basics/layout";       // Layout components
@import "basics/base";         // Base styles

// Component styles
@import "cmps/AppHeader";      // Header styles
@import "cmps/StayList";       // Stay listing styles
@import "cmps/StayFilter";     // Filter styles
```

### CSS Modules Usage
```jsx
import styles from './StayList.module.css'

export function StayList() {
  return (
    <div className={styles.stayGrid}>
      {/* Component content */}
    </div>
  )
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1440px
- Flexible grid layouts
- Touch-friendly interactions

## 🔌 Services & API Integration

### HTTP Service
```javascript
import { httpService } from './services/http.service'

// GET request
const stays = await httpService.get('stay')

// POST request
const newStay = await httpService.post('stay', stayData)

// PUT request
const updatedStay = await httpService.put(`stay/${stayId}`, updates)

// DELETE request
await httpService.delete(`stay/${stayId}`)
```

### Socket Service
```javascript
import { socketService } from './services/socket.service'

// Connect to WebSocket
socketService.setup()

// Listen for events
socketService.on('chat-new-msg', (msg) => {
  // Handle new message
})

// Emit events
socketService.emit('user-watch', userId)
```

### Custom Hooks
```javascript
// Form handling
const { register, handleSubmit, errors } = useForm()

// Field control
const { value, onChange, onBlur } = useFieldControl(initialValue)

// Mobile detection
const isMobile = useIsMobile()

// Places autocomplete
const { suggestions, getSuggestions } = usePlacesAutocomplete()
```

## 🎭 Component Examples

### Stay List Component
```jsx
export function StayList({ stays, onStaySelect }) {
  return (
    <div className="stay-list">
      {stays.map(stay => (
        <StayPreview 
          key={stay._id} 
          stay={stay} 
          onSelect={onStaySelect}
        />
      ))}
    </div>
  )
}
```

### Stay Filter Component
```jsx
export function StayFilter({ filterBy, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="stay-filter">
      <button onClick={() => setIsOpen(!isOpen)}>
        Filters
      </button>
      {isOpen && (
        <FilterSheet 
          filterBy={filterBy}
          onChange={onFilterChange}
        />
      )}
    </div>
  )
}
```

### Date Range Picker
```jsx
export function DateRangePicker({ dates, onDatesChange }) {
  return (
    <div className="date-picker">
      <DateRangePanel 
        dates={dates}
        onDatesChange={onDatesChange}
      />
    </div>
  )
}
```

## 📱 Mobile Experience

### Mobile-First Features
- **Touch Navigation**: Swipe gestures for image galleries
- **Mobile Header**: Collapsible navigation menu
- **Bottom Tab Bar**: Quick access to main features
- **Responsive Images**: Optimized images for different screen sizes
- **Mobile Filters**: Slide-up filter sheet for mobile

### Progressive Web App (PWA)
- Service worker for offline functionality
- App-like experience on mobile devices
- Push notifications support
- Installable on home screen

## 🎨 UI Components

### Material-UI Integration
```jsx
import { Button, TextField, Card } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

// Usage
<Button variant="contained" color="primary">
  Book Now
</Button>

<TextField 
  label="Search destinations"
  variant="outlined"
  fullWidth
/>
```

### Custom Components
- **StayPreview**: Property card with image, price, and rating
- **StayGallery**: Image carousel with thumbnails
- **ReviewList**: Review display with ratings
- **UserMsg**: Toast notification system
- **Pagination**: Page navigation component

## 🔧 Development Tools

### Available Scripts
```bash
npm run dev              # Start development server
npm run dev:local        # Use local backend
npm run dev:remote       # Use remote backend
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Vite Configuration
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../back-sharebnb/public',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_LOCAL': 'false'
  }
})
```

## 🎯 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy components

### Image Optimization
- Responsive images with multiple sizes
- Lazy loading for images
- WebP format support

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Vendor chunk splitting

## 🧪 Testing Strategy

### Component Testing
```jsx
import { render, screen } from '@testing-library/react'
import { StayList } from './StayList'

test('renders stay list', () => {
  const mockStays = [
    { _id: '1', name: 'Test Stay', price: 100 }
  ]
  
  render(<StayList stays={mockStays} />)
  expect(screen.getByText('Test Stay')).toBeInTheDocument()
})
```

### State Testing
```javascript
import { stayReducer } from './stay.reducer'

test('should handle LOAD_STAYS', () => {
  const initialState = { stays: [] }
  const action = { type: 'LOAD_STAYS', stays: mockStays }
  
  const newState = stayReducer(initialState, action)
  expect(newState.stays).toEqual(mockStays)
})
```

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Files are automatically copied to backend public folder
```

### Environment Configuration
```bash
# Development
VITE_LOCAL=true          # Use local backend
VITE_API_URL=http://localhost:3030

# Production
VITE_LOCAL=false         # Use remote backend
VITE_API_URL=https://your-api-domain.com
```

## 📊 Analytics & Monitoring

### User Analytics
- Page view tracking
- User interaction metrics
- Conversion funnel analysis
- Performance monitoring

### Error Tracking
- Client-side error logging
- Performance metrics
- User experience monitoring

## 🤝 Contributing

### Development Guidelines
1. Use functional components with hooks
2. Follow React best practices
3. Write meaningful component names
4. Use TypeScript for type safety (if migrating)
5. Write tests for new features
6. Follow the established folder structure

### Code Style
- ESLint configuration included
- Prettier for code formatting
- Consistent naming conventions
- Component documentation

## 📄 License

MIT License - Built with ❤️ for modern fullstack development

---

**Sharebnb Frontend** - A production-ready Airbnb clone frontend with modern React architecture, comprehensive booking system, and exceptional user experience across all devices.