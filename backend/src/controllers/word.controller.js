const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const { validateRequiredInput, checkEmptyRequiredFields } = require("../utils");
const WordService = require("../services/WordService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createWord = async (req, res) => {
  // validate
  try {
    console.log("createWord ~ createWord: route", )

    const requiredFields = validateRequiredInput(req.body, [
      "title",
      "keyWord",
      "pronounciation",
      "definition",
      "topicId",
    ]);

    if (requiredFields.length > 0) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "Error",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        message: `The field [${requiredFields[0]}] is required`,
      });
    }

    const userId = req.user._id;
    const response = await WordService.create(req.body, userId);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch(error) {
    console.log("createWord ~ error:", error)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const getWords = async (req, res) => {
  try {
 
    
    const response = await WordService.getWords(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("getWord ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const updateOnlyInfoWord = async (req, res) => {
  try {
    console.log("updateOnlyInfoWord ~ updateOnlyInfoWord: route", )

    const updateId = req.params.id;


    // Validate empty required fields
    const emptyRequiredFields = checkEmptyRequiredFields(req.body, [
      "title",
      "keyWord",
      "pronounciation",
      "definition",
      "lessonId",
      "topicId",
    ]);
    if (emptyRequiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${emptyRequiredFields[0]}] must not be empty`,
      });
    }

    const response = await WordService.updateOnlyInfoWord(req.body, updateId);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (error) {
    console.log("updateOnlyInfoWord ~ error:", error)
    return returnInternalErrorResponse(res);
  }
};

const markAsReviewed = async (req, res) => {
  try {
    const updateId = req.params.id;

    const response = await WordService.markAsReviewed(updateId);
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

const markMultipleAsReviewed  = async (req, res) => {
  try {
    const updateIds = req.body.ids;

    if (!updateIds) {
      return returnInvalidErrorResponse(res, {
        message: "The field [ids] is required",
      });
    }

    const response = await WordService.markMultipleAsReviewed(updateIds);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (error){
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const getDetailWord = async (req, res) => {
  try {
    const updateId = req.params.id;

    const response = await WordService.getDetailWord(updateId);
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

module.exports = {
  createWord,
  getWords,
  updateOnlyInfoWord,
  markAsReviewed,
  getDetailWord,
  markMultipleAsReviewed
};
