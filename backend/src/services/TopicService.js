/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Topic = require("../models/topic.model");
const { calcPagination } = require("../utils/query");

const create = (newData, userId) => {
  return new Promise(async (resolve, reject) => {
    const { name, type } = newData;
    const trimName = name.trim();

    try {
      const newDatas = {
        name: trimName,
        userId,
        type
      };

      const checkTopic = await Topic.findOne({ name: trimName , userId, type });
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

const getList = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const loggedInUser = req.user._id;
      const {filter, limit, page} = req.query;
      let query = filter ? JSON.parse(filter) : {};
      query.userId = loggedInUser;

      // Pagination
      const {calcLimit, skip} = calcPagination(page, limit);

      // Query
      if (query.name) {
        query.name = { $regex: query.name?.trim() || "", $options: "i" };
      }

      const topicQuery = [
        { $match: query },
      ]

      const result = await Topic.aggregate([
        ...topicQuery,
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: calcLimit }],
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

const update = (updatedData = {}, updateId, userId) => {
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
        const checkExistedTopicName = await Topic.findOne({ name: trimedName, userId, type: updatedData.type });

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
