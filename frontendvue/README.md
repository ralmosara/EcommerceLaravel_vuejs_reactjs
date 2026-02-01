# Vue.js E-Commerce Frontend

A modern, production-ready Vue.js 3 frontend for a music e-commerce platform (Punk Rock Records) that integrates with a Laravel 11 backend.

## Technology Stack

### Core Framework
- **Vue 3.5+** with Composition API
- **TypeScript** for type safety
- **Vite 6** for fast development and optimized builds

### Essential Libraries
- **Vue Router 4** - Client-side routing with authentication guards
- **Pinia** - State management (official Vue recommendation)
- **Axios** - HTTP client with interceptors
- **VueUse** - Composition utilities
- **Zod** - Runtime validation

### UI & Styling
- **Tailwind CSS 3** - Utility-first styling
- **HeadlessUI Vue** - Accessible UI components
- **Heroicons Vue** - Icon library
- **Vue Toastification** - Toast notifications

### Payment Integration
- **@stripe/stripe-js** - Stripe payment processing

### Data Fetching
- **TanStack Query Vue (Vue Query)** - Server state management and caching

## Project Structure

```
frontendvue/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── endpoints/         # API endpoint modules
│   │   │   └── auth.ts        # ✅ Authentication endpoints
│   │   └── types/             # TypeScript types
│   │       ├── models.ts      # ✅ All backend model types
│   │       └── responses.ts   # ✅ API response types
│   ├── assets/
│   │   └── styles/
│   │       └── main.css       # ✅ Tailwind configuration
│   ├── components/
│   │   └── layout/            # Layout components
│   │       ├── AppHeader.vue  # ✅ Header with navigation
│   │       ├── AppFooter.vue  # ✅ Footer
│   │       ├── MainLayout.vue # ✅ Main customer layout
│   │       └── AdminLayout.vue # ✅ Admin panel layout
│   ├── router/
│   │   ├── index.ts           # ✅ Router configuration
│   │   └── guards.ts          # ✅ Auth/admin guards
│   ├── stores/                # Pinia stores
│   │   └── auth.ts            # ✅ Authentication state
│   ├── views/                 # Page components
│   │   ├── Home.vue           # ✅ Homepage
│   │   ├── auth/              # Authentication pages
│   │   │   ├── Login.vue      # ✅ Login page
│   │   │   ├── Register.vue   # ✅ Registration page
│   │   │   └── Profile.vue    # ✅ User profile page
│   │   ├── catalog/           # 🔲 Product catalog (Phase 2)
│   │   ├── Cart.vue           # 🔲 Shopping cart (Phase 4)
│   │   ├── Checkout.vue       # 🔲 Checkout (Phase 5)
│   │   ├── orders/            # 🔲 Order management (Phase 6)
│   │   ├── Wishlist.vue       # 🔲 Wishlist (Phase 7)
│   │   └── admin/             # 🔲 Admin panel (Phases 8-10)
│   ├── App.vue                # ✅ Root component
│   └── main.ts                # ✅ Application entry point
├── .env                       # ✅ Environment variables
├── package.json               # ✅ Dependencies
├── tailwind.config.js         # ✅ Tailwind configuration
├── tsconfig.json              # ✅ TypeScript configuration
└── vite.config.ts             # ✅ Vite configuration

✅ = Implemented
🔲 = Placeholder (to be implemented)
```

## What's Implemented (Phase 1: Authentication & Foundation)

### ✅ Completed Features

1. **Project Setup**
   - Vue 3 + TypeScript + Vite configuration
   - Tailwind CSS with custom design system
   - ESLint and Prettier configuration
   - All dependencies installed

2. **Authentication System**
   - User registration with validation
   - Login with credentials
   - Logout functionality
   - Profile management (view/update user info)
   - Token-based authentication (Laravel Sanctum)
   - Automatic token persistence (localStorage)
   - Protected route guards

3. **API Integration**
   - Axios client with base URL configuration
   - Request interceptor (auto-attach Bearer token)
   - Response interceptor (global error handling)
   - Auth API endpoints (login, register, logout, getMe, updateProfile)
   - TypeScript types for all backend models

4. **State Management**
   - Pinia auth store with:
     - User state management
     - Token management
     - Login/register/logout actions
     - Role-based access (isAdmin, isCustomer)
     - Automatic auth initialization on app load

5. **Routing**
   - Vue Router with all routes defined
   - Auth guard (protect authenticated routes)
   - Admin guard (protect admin-only routes)
   - Guest guard (redirect authenticated users)
   - Scroll behavior

6. **Layouts**
   - MainLayout with header and footer
   - AdminLayout with sidebar navigation
   - Responsive navigation
   - User dropdown menu

7. **UI Components**
   - AppHeader with navigation and user menu
   - AppFooter with links
   - Reusable Tailwind utility classes
   - Toast notifications (success/error/info)

8. **Pages**
   - Home page with hero section
   - Login page
   - Registration page
   - User profile page
   - Placeholder pages for all other routes

## Environment Setup

### Prerequisites
- Node.js 22+ (or 20.19+)
- npm, yarn, or pnpm
- Laravel backend running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# .env file is already created
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # Lint and fix code
npm run format       # Format code with Prettier
```

## Testing Authentication

1. **Start the backend:**
   - Make sure your Laravel backend is running on `http://localhost:8000`
   - Database should be migrated and seeded

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

3. **Test registration:**
   - Navigate to `http://localhost:5173/register`
   - Fill in the form (name, email, password, password confirmation)
   - Submit to create a new account
   - You'll be automatically logged in and redirected to home

4. **Test login:**
   - Navigate to `http://localhost:5173/login`
   - Enter credentials
   - Submit to login
   - Token will be stored and user info will be saved

5. **Test protected routes:**
   - Try accessing `/profile` without logging in → redirected to login
   - Try accessing `/admin` as a customer → redirected to home
   - Login as admin to access admin panel

6. **Test profile update:**
   - Go to `/profile` when logged in
   - Update name, email, or phone
   - Optionally change password
   - Submit to update

## Implementation Plan (Remaining Phases)

### Phase 2: Product Catalog & Browse ⏳
- Album listing with pagination
- Album detail page with tracks and reviews
- Artist and Genre pages
- Filters (format, price, genre)
- Rating display
- Vue Query integration

### Phase 3: Search Functionality ⏳
- Global search across albums and artists
- Autocomplete suggestions
- Debounced search input
- Search results page

### Phase 4: Shopping Cart ⏳
- Cart state management (Pinia)
- Add/remove items
- Update quantities
- Coupon application
- Cart persistence

### Phase 5: Checkout & Stripe Payment ⏳
- Multi-step checkout flow
- Address form
- Stripe payment integration
- Order creation
- Payment success page

### Phase 6: Order Management ⏳
- Order history listing
- Order detail page
- Order cancellation
- Order status tracking

### Phase 7: Reviews & Wishlist ⏳
- Submit/edit/delete reviews
- Rating system (1-5 stars)
- Wishlist management
- Add/remove from wishlist

### Phase 8: Admin Dashboard & Analytics ⏳
- Dashboard statistics
- Sales charts
- Recent activity feed
- Key metrics display

### Phase 9: Admin Order & User Management ⏳
- Order management table
- Update order status
- User management
- Role changes
- Statistics

### Phase 10: Admin Inventory & Content Management ⏳
- Inventory management
- Stock updates
- CRUD for albums, artists, genres
- Image uploads
- Low-stock alerts

## API Endpoints Reference

All API calls go through `http://localhost:8000/api/v1/`

### Implemented Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/me` - Get current user (requires auth)
- `PUT /auth/me` - Update profile (requires auth)

### Endpoints to Implement

See the implementation plan for full API endpoint list in each phase.

## Key Technical Decisions

1. **Composition API** - Better TypeScript support, more flexible code organization
2. **TypeScript** - Type safety for complex data structures
3. **Pinia** - Simpler API than Vuex, better TypeScript support
4. **Vue Query** - Automatic caching and background refetching
5. **Tailwind CSS** - Rapid development with utility classes
6. **Token in localStorage** - Simple persistence for Sanctum tokens

## Error Handling

- **Network errors**: Toast notification displayed
- **401 Unauthorized**: Token cleared, redirect to login
- **403 Forbidden**: Access denied message
- **422 Validation**: Field-specific errors shown
- **500 Server Error**: Generic error message

## Authentication Flow

1. User enters credentials → API call to `/auth/login`
2. Backend returns `{user, token, token_type}`
3. Token stored in `localStorage` as `auth_token`
4. User data stored in Pinia auth store
5. Token automatically attached to all API requests
6. On app load, token is read from localStorage
7. If token exists, user data is fetched to verify validity
8. On logout, token is cleared and user is redirected

## Router Guards

- **authGuard**: Requires authentication, redirects to `/login` if not authenticated
- **adminGuard**: Requires admin role, redirects to `/` if not admin
- **guestGuard**: Redirects authenticated users to `/`

## Development Tips

1. **Hot Module Replacement (HMR)**: Vite provides instant updates during development
2. **DevTools**: Install Vue DevTools for state inspection
3. **Pinia DevTools**: Automatically integrated for store debugging
4. **TypeScript Errors**: Run `npm run type-check` to find type issues
5. **Tailwind IntelliSense**: Install VSCode extension for class autocomplete

## Next Steps

1. Start implementing Phase 2 (Product Catalog)
2. Create album API endpoints and components
3. Set up Vue Query for data fetching
4. Build AlbumCard and AlbumGrid components
5. Implement filters and pagination

## Troubleshooting

### Port already in use
```bash
# Change port in vite.config.ts
server: {
  port: 5174  // or another port
}
```

### API connection refused
- Ensure Laravel backend is running on port 8000
- Check `.env` file has correct `VITE_API_BASE_URL`

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

Follow the implementation plan phases in order. Each phase builds on the previous one.

## License

This project is built for educational and demonstration purposes.
