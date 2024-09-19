import mongoose from "mongoose";

const insurenceSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    insurenceStartDate: {
      type: Date,
      required: true,
    },
    insurenceEndDate: {
      type: Date,
      required: true,
    },
    pdf: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Insurence", insurenceSchema);
