const { cloudinary } = require("../configs/cloudinary");
const {
  returnInternalErrorResponse,
  returnGetSuccessResponse,
  returnInvalidErrorResponse,
} = require("../utils/returnResponse");
const { getOriginalFileNameFromFileName } = require("../utils/handleFile");

const uploadImage = async (req, res) => {
  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return returnInvalidErrorResponse(res, {
        message: "No files were uploaded.",
      });
    }

    // validate only single file
    if (req.files.file.length > 1) {
      return returnInvalidErrorResponse(res, {
        message: "Only upload a single file",
      });
    }

    const uploadedFile = req.files.file;
    // Lấy tên gốc của file từ file.name
    const originalFileName = getOriginalFileNameFromFileName(uploadedFile.name);
    const result = await cloudinary.uploader.upload(
      uploadedFile.tempFilePath,
      // optionsCloundinary
      {
        public_id: originalFileName,
      }
    );
    return returnGetSuccessResponse(res, {
      message: "Upload successfully",
      data: {
        imageUrl: result.secure_url,
      },
    });
  } catch (error) {
    console.log("uploadImage ~ error:", error);
    return returnInternalErrorResponse(res, { error: error.message });
  }
};

module.exports = {
  uploadImage,
};
