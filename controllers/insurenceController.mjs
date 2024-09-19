import insurenceModel from "../models/insurenceModel.mjs";
import User from "../models/userModel.mjs";
export const getInsurenceById = async (req, res) => {
  const userId = req.userId;
  try {
    const insurence = await insurenceModel.find({ userId: userId });
    res.status(200).json(insurence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Other methods remain unchanged

export const addInsurence = async (req, res) => {
  const userId = req.userId;
  const {
    vehicleName,
    modelName,
    vehicleNumber,
    insurenceStartDate,
    insurenceEndDate,
  } = req.body;
  try {
    const insurence = await insurenceModel.create({
      userId,
      vehicleName,
      modelName,
      vehicleNumber,
      insurenceStartDate,
      insurenceEndDate,
    });
    res.status(201).json(insurence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInsurenceById = async (req, res) => {
  const userId = req.userId;
  const oldVehicleNumber = req.params.vehicleNumber;
  const {
    vehicleName,
    modelName,
    vehicleNumber,
    insurenceStartDate,
    insurenceEndDate,
  } = req.body;
  try {
    const insurence = await insurenceModel.findOneAndUpdate(
      { userId: userId, vehicleNumber: oldVehicleNumber },
      {
        vehicleName,
        modelName,
        vehicleNumber,
        insurenceStartDate,
        insurenceEndDate,
      },
      { new: true }
    );
    res.status(200).json(insurence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const upload_pdf = async (req, res) => {
  const userId = req.body.userId;  // Correct access
  const pdflink = req.body.pdflink; // Correct access

  console.log(userId,pdflink);
  // Validate userId and pdflink
  if (!userId || !pdflink) {
      return res.status(400).json({ error: "User ID and PDF link are required" });
  }

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      user.pdfs.push({ name: "Resume File", url: pdflink });
      await user.save();
      res.status(200).json({ message: "PDF uploaded successfully" });
  } catch (error) {
      console.error("Error saving PDF:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};




export const delete_pdf = async (req, res) => {
  const userId = req.userId;
  const pdfId = req.pdfId;

  const user = await User.findById(userId);
  user.pdfs.id(pdfId).remove();
  await user.save();

  

};


export const getUserPdfs = async (req, res) => {
  const userId = req.body.userId;

  try {
    // Find user by ID and select the 'pdfs' field
    const user = await User.findById(userId).select('pdfs');
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user's PDFs
    return res.status(200).json({ success: true, pdfs: user.pdfs });
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json({ success: false, message: error.message });
  }
};

