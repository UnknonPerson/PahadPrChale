# PahadPerChale Backend API

Backend API for PahadPerChale - North East Travel Planner.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
Backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth, admin, error handling
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   ├── db/              # Database connection
│   ├── app.js           # Express app setup
│   └── index.js         # Entry point
├── .env
├── package.json
└── README.md
```

## Installation

```bash
cd Backend
npm install
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pahadperchale
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user (Protected) |
| PUT | /api/auth/update-profile | Update profile (Protected) |
| PUT | /api/auth/change-password | Change password (Protected) |

### Destinations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/destinations | Get all destinations |
| GET | /api/destinations/:id | Get single destination |
| POST | /api/destinations | Create destination (Admin) |
| PUT | /api/destinations/:id | Update destination (Admin) |
| DELETE | /api/destinations/:id | Delete destination (Admin) |

### Packages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/packages | Get all packages |
| GET | /api/packages/:id | Get single package |
| POST | /api/packages | Create package (Admin) |
| PUT | /api/packages/:id | Update package (Admin) |
| DELETE | /api/packages/:id | Delete package (Admin) |

### Hotels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hotels | Get all hotels |
| GET | /api/hotels/:id | Get single hotel |
| POST | /api/hotels | Create hotel (Admin) |
| PUT | /api/hotels/:id | Update hotel (Admin) |
| DELETE | /api/hotels/:id | Delete hotel (Admin) |

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vehicles | Get all vehicles |
| GET | /api/vehicles/:id | Get single vehicle |
| POST | /api/vehicles | Create vehicle (Admin) |
| PUT | /api/vehicles/:id | Update vehicle (Admin) |
| DELETE | /api/vehicles/:id | Delete vehicle (Admin) |

### Trips

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/trips | Create trip request |
| GET | /api/trips/my | Get user's trips |
| GET | /api/trips/:id | Get single trip |
| PUT | /api/trips/:id | Update trip |
| PUT | /api/trips/:id/cancel | Cancel trip |
| DELETE | /api/trips/:id | Delete trip |
| GET | /api/trips/admin/all | Get all trips (Admin) |
| PUT | /api/trips/admin/:id | Update trip status (Admin) |

### Testimonials

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/testimonials | Get all testimonials |
| GET | /api/testimonials/:id | Get single testimonial |
| POST | /api/testimonials | Create testimonial |
| DELETE | /api/testimonials/:id | Delete testimonial |
| PUT | /api/testimonials/:id/approve | Approve testimonial (Admin) |
| PUT | /api/testimonials/:id/reject | Reject testimonial (Admin) |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | Get user's bookings |
| GET | /api/bookings | Get all bookings (Admin) |
| GET | /api/bookings/:id | Get single booking |
| PUT | /api/bookings/:id/status | Update status (Admin) |
| DELETE | /api/bookings/:id | Delete booking (Admin) |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

JWT tokens are stored in HTTP-only cookies. Include credentials in requests:

```javascript
fetch('http://localhost:5000/api/auth/me', {
  credentials: 'include'
});
```

## Demo Admin Account

Create an admin user through MongoDB or register and manually update the role to 'admin'.

## License

MIT
