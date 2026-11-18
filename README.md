# 🎬 IMovies — Next-Gen Full-Stack Cinema Ticket Booking Platform

**IMovies** is a full-stack cinema and multiplex ticket booking platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) and Socket.io.

## 🌟 Key Features

1. **Real-Time Seat Locking (Socket.io)**
   - Live seat availability updates.
   - 5-minute seat reservation hold timer.
   - Automatic seat release on disconnect or expiration.

2. **Interactive Cinematic Seating Map**
   - VIP Recliners, Premium Club and Standard Classic seating.
   - Dynamic seat selection and availability indicators.

3. **Movie Search & Filters**
   - Search by movie title, director and cast.
   - Filter by genre, language and movie status.

4. **Digital Cinema Tickets**
   - QR-code-based digital tickets.
   - Booking reference and seat details.
   - Print and save ticket functionality.

5. **Customer Booking Management**
   - Active tickets and booking history.
   - Ticket cancellation and automated refund calculation.

6. **Payment & Promo Codes**
   - Simulated card, UPI and net banking checkout.
   - Promotional coupons: `IMOVIES50` and `VIPPASS`.

7. **Authentication & Security**
   - JWT authentication.
   - Password hashing using bcryptjs.
   - Role-based authorization for users and admins.
   - Express rate limiting.

8. **Admin Dashboard**
   - Revenue and ticket analytics.
   - Movie and showtime management.
   - Automatic seat generation.

## 🏛️ Tech Stack

- **Frontend:** React 19, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Authentication:** JWT, bcryptjs
- **Additional Libraries:** QR Code, canvas-confetti

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher
- MongoDB or MongoDB Atlas

### Installation

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Configuration

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Run the Application

**Terminal 1 – Backend**

```bash
cd server
npm start
```

**Terminal 2 – Frontend**

```bash
cd client
npm run dev
```

Open: http://localhost:5173

## 📡 REST API Overview

| Module | Endpoints |
|---|---|
| Authentication | Register, Login, Get Profile |
| Movies | Get Movies, Search, Add, Update, Delete |
| Theatres | Get Theatres, Manage Shows |
| Bookings | Create Booking, View History, Cancel Booking |
| Admin | Revenue Statistics, Ticket Analytics |

## 🎨 UI Design

- Dark cinematic theme.
- Neon ultraviolet, electric cyan and gold accents.
- Modern typography using Outfit and Inter.
- Smooth animations and interactive seat selection.

---

**Built with ❤️ using the MERN Stack.**