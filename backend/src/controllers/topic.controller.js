const { validateRequiredInput } = require("../utils");
const TopicService = require("../services/TopicService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createTopic = async (req, res) => {
  // validate
  try {
    const requiredFields = validateRequiredInput(req.body, [
      "name",
      "type"
    ]);

    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${requiredFields[0]}] is required`,
      });
    }
    const userId = req.user._id;

    const response = await TopicService.create(req.body, userId);
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

const getTopics = async (req, res) => {
  try {
    const response = await TopicService.getList(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("get Topics ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const updateTopic = async (req, res) => {
  try {
    const updateId = req.params.id;
    const userId = req.user._id;

    // Validate empty name
    if (req.body.name && !req.body.name.trim()) {
      return returnInvalidErrorResponse(res, {
        message: "The field [name] must not be empty",
      });
    }

    // Must have type
    const requiredFields = validateRequiredInput(req.body, [
      "type"
    ]);
    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${requiredFields[0]}] is required`,
      });
    }

    const response = await TopicService.update(req.body, updateId, userId);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (err) {
    return returnInternalErrorResponse(res, {error: err.message});
  }
};

const getOneTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const response = await TopicService.getOne(topicId);
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


module.exports = {
  createTopic,
  getTopics,
  updateTopic,
  getOneTopic
};
