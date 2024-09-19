import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Define a sub-schema for the PDFs
const pdfSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false, // This prevents MongoDB from creating a separate _id for each PDF entry
  }
);

// Define the main user schema
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Array of PDFs using the pdfSchema
    pdfs: [pdfSchema],
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema


userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        username:this.username,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default mongoose.model("User", userSchema);
