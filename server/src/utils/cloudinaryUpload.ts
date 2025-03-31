import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (file: string) => {
  try {
    // Log configuration status
    // console.log("Cloudinary Config:", {
    //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    //   api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
    //   api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
    // });

    if (!file) {
      throw new Error("No file provided");
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "swap-book/profiles",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "jpeg", "gif"],
    });

    if (!result || !result.secure_url) {
      throw new Error("Upload failed - no secure URL returned");
    }

    console.log("Upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error: any) {
    console.error("Cloudinary Upload Error Details:", {
      message: error.message,
      error: error,
    });
    throw error;
  }
};
