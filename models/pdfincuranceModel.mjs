import mongoose from "mongoose";

const InsurenceSchema = new mongoose.Schema(
  {
    vehicleName: String,
    modelName: String,
    vehicleNumber: String,
    pdfPath: String,
    userId: String,
  },
  { collection: "PdfDetails" }
);

const InsurenceModel = mongoose.model("InsurenceModel", InsurenceSchema);

export default InsurenceModel;
