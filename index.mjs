import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Stripe from 'stripe'; 






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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API routes
app.use("/api/auth", authRoute);
app.use("/api/", insurenceRoute);
app.use("/api/userdata/", userdata);


app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PDF Download',
          },
          unit_amount: 0, // $5.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.headers.origin}/Dashboard`,
    cancel_url: `${req.headers.origin}/Dashboard`,
  });

  res.json({ id: session.id });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
