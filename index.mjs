import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Stripe from 'stripe'; 






// Import routes
import authRoute from "./routers/authRoutes.mjs";
import insurenceRoute from "./routers/insurenceRoute.mjs";
import userdata from "./routers/userdataroutes.mjs";
import User from "./models/userModel.mjs";

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
  origin: "*",
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


app.post('/api/create-checkout-session', async (req, res) => {
  try {
  const { userId } = req.body;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not Found" + userId);
      return res.status(404).json({ error: 'User not found' });
    }
   
    
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PDF Download',
          },
          unit_amount: 500, // $5.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.headers.origin}/Success?status=success&userId=${userId}`,
    cancel_url: `${req.headers.origin}/Dashboard`,
    customer_email: user.email,
  });

  res.json({ id: session.id });
} catch (error) {
  console.error('Error creating checkout session:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});



app.post('/api/update-subscription', async (req, res) => {
  
  const { userId } = req.body;
    console.log(userId);
  try {
    
    const user = await User.findById(userId);
      if (user) {
        const currentDate = new Date();
        const endDate = new Date(currentDate.setDate(currentDate.getDate() + 30)); // Set end date 30 days from now

        // Update subscription details
        user.subscription = {
          endDate: endDate,
          isActive: true,
        };

        await user.save();
        console.log(`User subscription updated for ${user.email}`);
        res.status(200).json({ error: 'Internal server error' });
      }
    } catch (error) {
      console.error('Error updating user subscription:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Return a 200 response to acknowledge receipt of the event
  app.post('/api/check-subscription', async (req, res) => {
    try {
      const { userId } = req.body
      console.log(userId);
      const user = await User.findById(userId); // Assuming req.userId is set by some authentication middleware
 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.subscription.isActive) {
        const currentDate = new Date();
        const endDate = new Date(user.subscription.endDate);
        
        // Calculate remaining days
        const remainingDays = Math.max(0, Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)));
  
        if (remainingDays > 0) {
          res.status(200).json({ isActive: true, remainingDays });
        } else {
          // Subscription expired
          user.subscription.isActive = false;
          await user.save();
          res.status(200).json({ isActive: false, remainingDays: 0 });
        }
      } else {
        res.status(200).json({ isActive: false, remainingDays: 0 });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
