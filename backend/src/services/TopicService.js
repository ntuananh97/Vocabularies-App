/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Topic = require("../models/topic.model");

const create = (newData, userId) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newData;
    const trimedName = name.trim();

    try {
      const newDatas = {
        name: trimedName,
        userId
      };

      const checkTopic = await Topic.findOne({ name: trimedName , userId });
      if (checkTopic) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "The topic is existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const createdData = await Topic.create(newDatas);

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

const getList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get all data
      const data = await Topic.find({});

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

const getOne = (topicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      // Get all data
      const data = await Topic.findById(topicId);

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

const update = (updatedData = {}, updateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkTopic = await Topic.findById(updateId);

      if (!checkTopic) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The topic is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      if (updatedData.name) {
        const trimedName = updatedData.name.trim();
        const checkExistedTopicName = await Topic.findOne({ name: trimedName });

        if (checkExistedTopicName) {
          return resolve({
            status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
            message: "The name of topic is existed",
            typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
            data: null,
            statusMessage: "Error",
          });
        }
      }

      // Modify fields
      Object.assign(checkTopic, updatedData);
      // Save the updated document
      await checkTopic.save();

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: checkTopic,
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
  getOne
};
