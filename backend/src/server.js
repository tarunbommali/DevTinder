require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const  { initilizeSocket } = require("./utils/socket");
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "https://devtindernetwork.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

initilizeSocket(server);

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// Connect to MongoDB and then start the server
connectDB()
    .then(() => {
    console.log("MongoDB connection established successfully");
    server.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    })
  })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    }
  );