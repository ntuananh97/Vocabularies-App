const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const { validateRequiredInput } = require("../utils");
const LessonService = require("../services/LessonService");

const { returnInternalErrorResponse } = require("../utils/returnResponse");

const createLesson = async (req, res) => {
  // validate
  try {
    const requiredFields = validateRequiredInput(req.body, [
      "name",
    ]);

    if (requiredFields.length > 0) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "Error",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        message: `The field [${requiredFields[0]}] is required`,
      });
    }

    const userId = req.user._id;
    const response = await LessonService.create(req.body, userId);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch {
    return returnInternalErrorResponse(res);
  }
};

const getLessons = async (req, res) => {
  try {
    const response = await LessonService.getLessons(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("getLessons ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};


module.exports = {
  createLesson,
  getLessons,
};
