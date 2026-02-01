# Punk Rock Records - E-Commerce Platform

A full-stack e-commerce platform for a music store built with **Laravel 12** (REST API), **Vue.js 3**, and **React 19**. Features a complete shopping flow from catalog browsing to Stripe-powered checkout.

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Backend  | Laravel 12, PHP 8.2+, MySQL, Laravel Sanctum        |
| Frontend | Vue 3 + TypeScript (primary), React 19 + TypeScript |
| Payments | Stripe                                              |
| Search   | Laravel Scout (database driver)                     |
| Styling  | Tailwind CSS                                        |

## Project Structure

```
├── backend/        # Laravel REST API
├── frontend/       # React + TypeScript frontend
└── frontendvue/    # Vue.js + TypeScript frontend
```

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EcommerceLaravel_vuejs_reactjs.git
cd EcommerceLaravel_vuejs_reactjs
```

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file and configure it
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Install frontend dependencies (for Vite asset bundling)
npm install

# Start the development server
composer dev
```

The `composer dev` command runs the PHP server, queue worker, Vite, and log viewer concurrently. The API will be available at `http://localhost:8000`.

### 3. Vue.js Frontend Setup

```bash
cd frontendvue

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the dev server
npm run dev
```

The Vue app runs at `http://localhost:5173`.

### 4. React Frontend Setup (Alternative)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the dev server
npm run dev
```

The React app runs at `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)

| Variable               | Description                      |
| ---------------------- | -------------------------------- |
| `DB_DATABASE`          | MySQL database name              |
| `DB_USERNAME`          | MySQL username                   |
| `DB_PASSWORD`          | MySQL password                   |
| `STRIPE_KEY`           | Stripe publishable key           |
| `STRIPE_SECRET`        | Stripe secret key                |
| `STRIPE_WEBHOOK_SECRET`| Stripe webhook signing secret    |
| `SCOUT_DRIVER`         | Search driver (`database`, `algolia`, `meilisearch`) |

### Frontends (`.env`)

| Variable                       | Description                |
| ------------------------------ | -------------------------- |
| `VITE_API_BASE_URL`            | Backend API URL            |
| `VITE_STRIPE_PUBLISHABLE_KEY`  | Stripe publishable key     |

## API Overview

All API routes are prefixed with `/api/v1`.

### Public Endpoints

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| POST   | `/auth/register`          | Register a new user   |
| POST   | `/auth/login`             | Login                 |
| GET    | `/albums`                 | List albums           |
| GET    | `/albums/featured`        | Featured albums       |
| GET    | `/albums/new-releases`    | New releases          |
| GET    | `/albums/{slug}`          | Album details         |
| GET    | `/artists`                | List artists          |
| GET    | `/genres`                 | List genres           |
| GET    | `/search`                 | Global search         |
| GET    | `/cart`                   | View cart             |
| POST   | `/cart/items`             | Add item to cart      |

### Protected Endpoints (require authentication)

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| POST   | `/orders`                 | Create order          |
| GET    | `/orders`                 | List user orders      |
| POST   | `/payments/create-intent` | Create Stripe payment |
| GET    | `/wishlist`               | View wishlist         |
| POST   | `/albums/{slug}/reviews`  | Post a review         |

### Admin Endpoints (require admin role)

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/admin/dashboard/stats`       | Dashboard stats     |
| GET    | `/admin/orders`                | Manage all orders   |
| POST   | `/admin/albums`                | Create album        |
| PUT    | `/admin/inventory/{slug}/stock`| Update stock        |

API documentation is available via Swagger at `/api/documentation` when the backend is running.

## Features

- **Authentication** - Register, login, profile management (Laravel Sanctum)
- **Product Catalog** - Browse albums with filtering by genre, format, price, and sorting
- **Search** - Full-text search with autocomplete suggestions
- **Shopping Cart** - Add/remove items, apply coupon codes
- **Checkout** - Multi-step checkout with Stripe payment integration
- **Orders** - Order history and status tracking
- **Reviews** - Rate and review albums
- **Wishlist** - Save albums for later
- **Admin Panel** - Dashboard, inventory management, order management, user management

## Available Scripts

### Backend

```bash
composer dev          # Start all dev services concurrently
php artisan serve     # Start PHP server only
php artisan migrate   # Run database migrations
php artisan db:seed   # Seed the database
php artisan test      # Run tests
```

### Vue.js Frontend

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run type-check    # Run TypeScript type checking
npm run lint          # Lint code
npm run format        # Format code with Prettier
```

### React Frontend

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run lint          # Lint code
npm run preview       # Preview production build
```

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to `backend/.env`:
   ```
   STRIPE_KEY=pk_test_...
   STRIPE_SECRET=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Add the publishable key to your frontend `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
5. For local webhook testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:8000/api/v1/stripe/webhook
   ```

## License

This project is open-sourced software.
