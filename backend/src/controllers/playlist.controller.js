const { validateRequiredInput } = require("../utils");
const PlaylistService = require("../services/PlaylistService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createPlaylist = async (req, res) => {
  // validate
  try {
    const creatingData = {...req.body};
    const requiredFields = validateRequiredInput(creatingData, [
      "name",
    ]);

    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${requiredFields[0]}] is required`,
      });
    }
    const userId = req.user._id;

    const response = await PlaylistService.create(creatingData, userId);
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

const getPlaylists = async (req, res) => {
  try {
    const response = await PlaylistService.getList(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("get Playlist ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { id: updateId } = req.params;
    const { name } = req.body;
    const updatedData = { ...req.body };

    const userId = req.user._id;
    const hasNameValue = name !== undefined;

    // Validate empty name
    if (hasNameValue && !name.trim()) {
      return returnInvalidErrorResponse(res, {
        message: "The field [name] must not be empty",
      });
    }

    if (hasNameValue) {
      updatedData.name = name.trim();
    }

    const response = await PlaylistService.update(updatedData, updateId, userId);
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

const getOnePlaylist = async (req, res) => {
  try {
    const musicId = req.params.id;

    const response = await PlaylistService.getOne(musicId);
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

const deletePlaylist = async (req, res) => {
  try {
    const deleteId = req.params.id;

    const response = await PlaylistService.deleteDocument(deleteId);
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


const addPlaylistToTopic = async (req, res) => {
  // validate
  try {
    const { topicId, playlistId } = req.params;

    if (!topicId || !playlistId) {
      return returnInvalidErrorResponse(res, {
        message: `The field topicId and playlistId are required`,
      });
    }

    const response = await PlaylistService.addPlaylistToTopic({
      topicId,
      playlistId
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

const removePlaylistFromTopic = async (req, res) => {
  // validate
  try {
    const { topicId, playlistId } = req.params;

    if (!topicId || !playlistId) {
      return returnInvalidErrorResponse(res, {
        message: `The field topicId and playlistId are required`,
      });
    }

    const response = await PlaylistService.removeMusicFromTopic({
      topicId,
      playlistId
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
  createPlaylist,
  getPlaylists,
  updatePlaylist,
  getOnePlaylist,
  deletePlaylist,
  addPlaylistToTopic,
  removePlaylistFromTopic
};
