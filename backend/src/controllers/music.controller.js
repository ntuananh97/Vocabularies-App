const { validateRequiredInput } = require("../utils");
const MusicService = require("../services/MusicService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createMusic = async (req, res) => {
  // validate
  try {
    const requiredFields = validateRequiredInput(req.body, [
      "title",
    ]);

    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${requiredFields[0]}] is required`,
      });
    }
    const userId = req.user._id;

    const response = await MusicService.create(req.body, userId);
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (error) {
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const getMusics = async (req, res) => {
  try {
    const response = await MusicService.getList(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("get Music ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const updateMusic = async (req, res) => {
  try {
    const updateId = req.params.id;
    const userId = req.user._id;

    // Validate empty name
    if (req.body.title && !req.body.title.trim()) {
      return returnInvalidErrorResponse(res, {
        message: "The field [title] must not be empty",
      });
    }

    const response = await MusicService.update(req.body, updateId, userId);
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

const getOneMusic = async (req, res) => {
  try {
    const musicId = req.params.id;

    const response = await MusicService.getOne(musicId);
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

const deleteMusic = async (req, res) => {
  try {
    const deleteId = req.params.id;

    const response = await MusicService.deleteDocument(deleteId);
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

const addMusicToTopic = async (req, res) => {
  // validate
  try {
    const { topicId, musicId } = req.params;

    if (!topicId || !musicId) {
      return returnInvalidErrorResponse(res, {
        message: `The field topicId and musicId are required`,
      });
    }

    const response = await MusicService.addMusicToTopic({
      topicId,
      musicId
    });
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (error) {
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const removeMusicFromTopic = async (req, res) => {
  // validate
  try {
    const { topicId, musicId } = req.params;

    if (!topicId || !musicId) {
      return returnInvalidErrorResponse(res, {
        message: `The field topicId and musicId are required`,
      });
    }

    const response = await MusicService.removeMusicFromTopic({
      topicId,
      musicId
    });
    const { data, status, typeError, message, statusMessage } = response;

    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch (error) {
    return returnInternalErrorResponse(res, {error: error.message});
  }
};


module.exports = {
  createMusic,
  getMusics,
  updateMusic,
  getOneMusic,
  deleteMusic,
  addMusicToTopic,
  removeMusicFromTopic
};
