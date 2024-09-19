import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoute from "./routers/authRoutes.mjs";
import insurenceRoute from "./routers/insurenceRoute.mjs";
import userdata from "./routers/userdataroutes.mjs";


// Load environment variables from .env file
dotenv.config();


// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) =>
    console.error("MongoDB connection error: Please check your code", err)
  );

const app = express();
const PORT = process.env.PORT || 5000;
cors(app);
// CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://insurance-frontend-blue.vercel.app",
    "https://resume-frontend-six.vercel.app", // Add this origin
  ],
  methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Static file serving


// API routes
app.use("/api/auth", authRoute);
app.use("/api/", insurenceRoute);
app.use("/api/userdata/", userdata);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
