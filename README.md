# GreatStore

## Overview

This is a full-stack eCommerce platform built with the MERN stack (MongoDB, Express.js, React.js, and Node.js), where users can browse products, add them to cart and place orders. The platform will have user authentication, product management, order tracking, and an admin dashboard for managing products and orders.

## Features

🗄️ MongoDB & Redis Integration  
💳 Stripe Payment Setup  
🔐 Robust Authentication System  
🔑 JWT with Refresh/Access Tokens  
📝 User Signup & Login  
🛒 E-Commerce Core  
📦 Product & Category Management  
🛍️ Shopping Cart Functionality  
💰 Checkout with Stripe  
🏷️ Coupon Code System  
👑 Admin Dashboard  
📊 Sales Analytics  
🎨 Design with Tailwind  
🛒 Cart & Checkout Process  
🔒 Security  
🛡️ Data Protection  
🚀Caching with Redis

## Getting Started

```
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Run this app locally
``` npm run build ```

### Start this app
``` npm run start ```

## Tech Stack

- **Frontend:** ReactJS with Tailwind CSS.
- **Backend:** NodeJS with ExpressJS (for APIs).
- **Database:** MongoDB and Redis.
- **Authentication:** JWT
- **Payment Gateway:** Stripe
- **Storing Images:** Cloudinary

<!-- Implementation of axios interceptors for refreshing access token -->