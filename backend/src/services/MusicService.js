/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Music = require("../models/music.model");
const Topic = require("../models/topic.model");
const { calcPagination, getAttributesForQuery } = require("../utils/query");

const create = (newData, userId) => {
  return new Promise(async (resolve, reject) => {

    try {
      const { title, lyric, files, topics } = newData;
      const trimTitle = title.trim();

      const newDatas = {
        title: trimTitle,
        userId,
        lyric,
        files,
        topics
      };

      const checkExistedMusicTitle = await Music.findOne({ title: trimTitle , userId });
      if (checkExistedMusicTitle) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "The music is existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const createdData = await Music.create(newDatas);

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
      if (query.title) {
        query.title = { $regex: query.title?.trim() || "", $options: "i" };
      }

        // Get attributes
        if (attributes) {
          const project = getAttributesForQuery(attributes);
          musicFacet.push({ $project: project });
        }

      const topicQuery = [
        { $match: query },
      ]

      const result = await Music.aggregate([
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

const getOne = (musicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      // Get all data
      const data = await Music.findById(musicId);

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
      const checkMusic = await Music.findById(updateId);

      if (!checkMusic) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The music is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      if (updatedData.title) {
        const trimedTitle = updatedData.title.trim();
        const checkExistedMusicTitle = await Music.findOne({
          title: trimedTitle,
          userId,
          _id: { $ne: updateId },
        }); // Loại trừ bản ghi hiện tại

        if (checkExistedMusicTitle) {
          return resolve({
            status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
            message: "The title of music is existed",
            typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
            data: null,
            statusMessage: "Error",
          });
        }
      }

      // Modify fields
      Object.assign(checkMusic, updatedData);
      // Save the updated document
      await checkMusic.save();

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: checkMusic,
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
      
      const data = await Music.findByIdAndDelete(deleteId);

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

const removeMusicFromTopic = ({
  topicId, musicId
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

      const updatedMusic = await Music.findByIdAndUpdate(
        musicId,
        { $pull: { topics: topicId } },
        { new: true } // Trả về tài liệu đã được cập nhật
      );

      if (!updatedMusic) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Music is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "Remove music from topic successfully",
        typeError: "",
        data: updatedMusic,
        statusMessage: "Success",
      });
     
    } catch (error) {
      reject(error);
    }
  });
};

const addMusicToTopic = ({
  topicId, musicId
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

      const music = await Music.findById(musicId);
      if (!music) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "Music is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const isMusicInTopic = music.topics.includes(topicId);

      // if music is not in topic, add it
      if (!isMusicInTopic) {
        music.topics.push(topicId);
        await music.save();

        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "added music to topic successfully",
          typeError: "",
          data: music,
          statusMessage: "Success",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "Music is already in topic",
        typeError: "",
        data: music,
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
  addMusicToTopic,
  removeMusicFromTopic
};
