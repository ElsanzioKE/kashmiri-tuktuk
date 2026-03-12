# Kashmiri TukTuk Spare Parts

E-commerce for Bajaj, TVS, Piaggio spare parts.

## Stack

- Frontend: React + Vite, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT
- Images: Cloudinary

## Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB and Cloudinary credentials

# Seed database
cd backend && npm run seed

# Run
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

Access at http://localhost:5173

## Test Accounts

- Admin: admin@kashmirituktuk.com / admin123456
- Customer: customer@test.com / customer123

## Key Features

- Product catalog with search, filter, sort
- Shopping cart
- Checkout with COD, Bank Transfer, Mobile Money
- Order tracking
- Admin dashboard for products, orders, categories
- Image uploads via Cloudinary
