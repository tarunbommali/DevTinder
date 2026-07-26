# DevTinder Backend

A Tinder-like application for developers to connect based on skills, experience, and interests.

## 🚀 Features

- User authentication (signup, login, logout)
- Profile management with detailed developer information
- Connection requests system (ignore, interested, accept, reject)
- User feed to discover other developers
- JWT-based authentication
- Password hashing with bcrypt
- CORS-enabled for frontend integration

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt for password hashing
- **Validation:** validator.js
- **Dev Tools:** nodemon

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<appName>
```

4. **Important:** Configure MongoDB Atlas:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to **Network Access** → **IP Access List**
   - Click **Add IP Address**
   - Add your current IP or use `0.0.0.0/0` for development (allow all IPs)
   - Wait 1-2 minutes for the changes to propagate

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:3000` with auto-reload enabled.

### Production Mode
```bash
npm start
```

## 📚 API Endpoints

### Authentication Routes (`/`)
- `POST /signup` - Create a new user account
- `POST /login` - Login with email and password
- `POST /logout` - Logout user

### Profile Routes (`/profile`)
- `GET /profile/view` - View current user profile (Protected)
- `PATCH /profile/edit` - Edit user profile (Protected)
- `PATCH /profile/password` - Change password (Protected)

### Request Routes (`/request`)
- `POST /request/send/:status/:userId` - Send connection request
- `POST /request/review/:status/:requestId` - Review connection request

### User Routes (`/user`)
- `GET /user/requests/received` - Get received connection requests (Protected)
- `GET /user/connections` - Get accepted connections (Protected)
- `GET /user/feed` - Get user feed (Protected)

For detailed API documentation, see [apiList.md](./apiList.md)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── middlewares/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── user.js              # User schema and model
│   │   └── connectionRequest.js # Connection request schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── profile.js           # Profile management routes
│   │   ├── request.js           # Connection request routes
│   │   └── user.js              # User-related routes
│   ├── utils/
│   │   ├── validation.js        # Input validation helpers
│   │   └── constants.js         # App constants
│   └── server.js                # Main application entry point
├── .env                         # Environment variables
├── package.json
└── README.md
```

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/devtinder` |

## 🐛 Troubleshooting

### "Error connecting to MongoDB: bad auth"
- Verify your MongoDB username and password in `.env`
- Check the credentials in MongoDB Atlas → Database Access

### "Operation `users.findOne()` buffering timed out"
- Ensure your IP is whitelisted in MongoDB Atlas → Network Access → IP Access List
- Check your internet connection
- Verify the MongoDB connection string format

### "MongoServerError: user is not allowed"
- Ensure the database user has read/write permissions
- Check Database Access settings in MongoDB Atlas

## 👤 User Schema

```javascript
{
  firstName: String (required, 4-50 chars),
  lastName: String (4-50 chars),
  emailId: String (required, unique, valid email),
  password: String (required, min 8 chars),
  age: Number (18+),
  gender: String (Male/Female/Other),
  profilePicture: String (URL),
  highestQualification: String,
  company: String,
  collegeInstitution: String,
  currentRole: String,
  totalExperience: Number,
  skills: [String],
  location: String
}
```

## 🔄 Connection Request Status

- `ignored` - User ignored the profile
- `interested` - User showed interest
- `accepted` - Connection request accepted
- `rejected` - Connection request rejected

## 🌐 CORS Configuration

The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://devtindernetwork.vercel.app`

## 📝 License

ISC

## 👨‍💻 Author

Tarun Bommali

---

**Note:** Make sure to never commit your `.env` file to version control. Add it to `.gitignore`.
