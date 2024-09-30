const { validateRequiredInput } = require("../utils");
const TopicService = require("../services/TopicService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createTopic = async (req, res) => {
  // validate
  try {
    const requiredFields = validateRequiredInput(req.body, [
      "name",
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


    // Validate empty name
    if (req.body.name && !req.body.name.trim()) {
      return returnInvalidErrorResponse(res, {
        message: "The field [name] must not be empty",
      });
    }

    const response = await TopicService.update(req.body, updateId);
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
