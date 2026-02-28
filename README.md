# 🛺 Kashmiri TukTuk Spare Parts — MERN E-Commerce

A production-ready full-stack e-commerce application for selling Bajaj, TVS, Piaggio and other TukTuk spare parts for Kashmir and East Africa.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, TailwindCSS, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Images | Cloudinary |
| State | React Context API |

---

## 📁 Folder Structure

```
kashmiri-tuktuk/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary + Multer config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT + role protection
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── seeder.js          # Database seed script
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── Spinner.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # User auth state
    │   │   └── CartContext.jsx  # Shopping cart state
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── AuthPages.jsx
    │   │   ├── StaticPages.jsx  # About + Contact
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js           # Axios instance + API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd kashmiri-tuktuk

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 2: Configure Environment

```bash
# In the backend folder
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kashmiri-tuktuk
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
JWT_EXPIRE=30d
NODE_ENV=development

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

### Step 3: Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin user**: `admin@kashmirituktuk.com` / `admin123456`
- **Test customer**: `customer@test.com` / `customer123`
- 8 product categories
- 6 sample products

### Step 4: Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Access the app at: **http://localhost:5173**

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| PATCH | `/api/products/:id/stock` | Admin |

**Query params:** `keyword`, `brand`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`, `featured`

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/my` | Private |
| GET | `/api/orders/:id` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |
| PUT | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Reviews
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/reviews/product/:productId` | Public |
| POST | `/api/reviews/product/:productId` | Private |
| DELETE | `/api/reviews/:id` | Private/Admin |

### Upload
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/upload` | Admin |
| DELETE | `/api/upload/:publicId` | Admin |

---

## 🎨 Features

### Customer Features
- 🏠 **Homepage** — Hero, featured products, brand categories, stats
- 🔍 **Product Search** — Full-text search, filter by brand/category/price, sort options
- 📦 **Product Details** — Image gallery, specifications, compatibility, reviews
- 🛒 **Shopping Cart** — Add/remove/update, persisted in localStorage
- 💳 **Checkout** — Shipping form, payment method selection (COD/Bank/Mobile Money)
- 📋 **Order Tracking** — Visual progress tracker, status history
- ⭐ **Reviews** — Verified purchase badge, star ratings
- 👤 **Auth** — Register, login, profile management

### Admin Features
- 📊 **Dashboard Stats** — Revenue, orders, stock alerts
- ➕ **Product CRUD** — Create, edit, delete products with full details
- 📈 **Stock Management** — Real-time stock levels, low-stock alerts
- 🔄 **Order Management** — Update order status, view all orders
- 🗂️ **Category Management** — View and manage product categories

---

## 🗄️ Database Schema

### User
```js
{ name, email, password (hashed), role (customer/admin), phone, address, isActive }
```

### Product
```js
{ name, slug, description, shortDescription, price, originalPrice, brand (Bajaj/TVS/Piaggio/Universal/Other), category, images[], stock, sku, specifications[], compatibility[], ratings, isFeatured, isActive, tags[] }
```

### Category
```js
{ name, slug, description, image, isActive }
```

### Order
```js
{ user, orderNumber, items[], shippingAddress, paymentMethod, paymentStatus, orderStatus, subtotal, shippingCost, tax, totalPrice, trackingNumber, statusHistory[], deliveredAt }
```

### Review
```js
{ user, product, rating (1-5), title, comment, isVerifiedPurchase, isApproved }
```

---

## 🌍 Business Context

The platform serves:
- **Kashmir, India** — Bajaj RE, TVS King TukTuks operating on mountain roads
- **East Africa** — Kenya, Tanzania, Uganda, Rwanda, Ethiopia — Piaggio Ape and Bajaj RE fleet

Pricing is in **INR (₹)** with GST applied. Free shipping on orders over ₹2,000.

---

## 📝 Environment Notes

- JWT tokens expire in 30 days by default
- Product images are stored on Cloudinary (configure before uploading)
- Without Cloudinary, images can be linked via URL in the product form
- The seeder provides placeholder image URLs from Unsplash for demo purposes
