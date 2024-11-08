/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Playlist = require("../models/playlist.model");
const Topic = require("../models/topic.model");
const { calcPagination, getAttributesForQuery } = require("../utils/query");

const create = (newData, userId) => {
  return new Promise(async (resolve, reject) => {

    try {
      const { name, description, musics, topics } = newData;
      const trimName = name.trim();

      const newDatas = {
        name: trimName,
        userId,
        description: description?.trim() || "",
        musics,
        topics
      };

      const checkExistedPlaylistTitle = await Playlist.findOne({ name: trimName , userId });
      if (checkExistedPlaylistTitle) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "The name of playlist is existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const createdData = await Playlist.create(newDatas);

      if (createdData) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "Created successfully",
          typeError: "",
          data: createdData,
          statusMessage: "Success",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.INVALID.status,
        message: "Error when create data",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        data: null,
        statusMessage: "Error",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getList = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const loggedInUser = req.user._id;
      const {filter, limit, page, attributes} = req.query;
      const musicFacet = [];

      let query = filter ? JSON.parse(filter) : {};
      query.userId = loggedInUser;

      // Pagination
      const {calcLimit, skip} = calcPagination(page, limit);
      musicFacet.push({ $skip: skip }, { $limit: calcLimit });

      // Query
      if (query.name) {
        query.name = { $regex: query.name?.trim() || "", $options: "i" };
      }

        // Get attributes
        if (attributes) {
          const project = getAttributesForQuery(attributes);
          musicFacet.push({ $project: project });
        }

      const topicQuery = [
        { $match: query },
      ]

      const result = await Playlist.aggregate([
        ...topicQuery,
        {
          $facet: {
            data: musicFacet,
            totalCount: [
              { $count: "count" }    // Count total documents
            ]
          }
        }
      ]);

      const data = {
        list: result[0].data || [],
        totalCount: result[0].totalCount?.[0]?.count || 0
      };

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Get data success",
        data,
        statusMessage: "Success",
      });
    } catch (error) {
      // console.log("returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

const getOne = (playlistId) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const data = await Playlist.findById(playlistId);

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Get data success",
        data,
        statusMessage: "Success",
      });
    } catch (error) {
      console.log("getOne ~ error:", error)
      reject(error);
    }
  });
};

const update =  (updatedData = {}, updateId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPlaylist = await Playlist.findById(updateId);
      const { name } = updatedData;

      if (!checkPlaylist) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The playlist is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      if (name) {
        const checkExistedPlaylistName = await Playlist.findOne({
          name,
          userId,
          _id: { $ne: updateId },
        }); // Loại trừ bản ghi hiện tại

        if (checkExistedPlaylistName) {
          return resolve({
            status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
            message: "The name of playlist is existed",
            typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
            data: null,
            statusMessage: "Error",
          });
        }
      }

      // Modify fields
      Object.assign(checkPlaylist, updatedData);
      // Save the updated document
      await checkPlaylist.save();

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: checkPlaylist,
        statusMessage: "Success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteDocument = (deleteId) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const data = await Playlist.findByIdAndDelete(deleteId);

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Delete data success",
        data,
        statusMessage: "Success",
      });
    } catch (error) {
      console.log("delete ~ error:", error)
      reject(error);
    }
  });
};

const addPlaylistToTopic = ({
  topicId, playlistId
}) => {
  return new Promise(async (resolve, reject) => {

    try {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Topic is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Playlist is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const isPlaylistInTopic = playlist.topics.includes(topicId);

      // if playlist is not in topic, add it
      if (!isPlaylistInTopic) {
        playlist.topics.push(topicId);
        await playlist.save();

        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "added playlist to topic successfully",
          typeError: "",
          data: playlist,
          statusMessage: "Success",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "Playlist is already in topic",
        typeError: "",
        data: playlist,
        statusMessage: "Success",
      });
     
    } catch (error) {
      reject(error);
    }
  });
};

const removeMusicFromTopic = ({
  topicId, playlistId
}) => {
  return new Promise(async (resolve, reject) => {

    try {
      
      const topicExists  = await Topic.exists({ _id: topicId });
      if (!topicExists ) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Topic is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { topics: topicId } },
        { new: true } // Trả về tài liệu đã được cập nhật
      );

      if (!updatedPlaylist) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Playlist is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "Remove playlist from topic successfully",
        typeError: "",
        data: updatedPlaylist,
        statusMessage: "Success",
      });
     
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  create,
  getList,
  update,
  getOne,
  deleteDocument,
  addPlaylistToTopic,
  removeMusicFromTopic
};
