/* eslint-disable no-async-promise-executor */

const { CONFIG_MESSAGE_ERRORS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE } = require("../configs/constants");
const dayjs = require('dayjs');
const Word = require('../models/word.model');
const Period = require('../models/period.model');

const ENABLE_USE_REVIEW_TODAY = "1";


const create = (newData, createdUserId) => {
  return new Promise(async (resolve, reject) => {
    const {
      title,
      keyWord,
      pronounciation,
      definition,
      description,
      lessonId,
      images,
      sounds,
      examples,
      topicId
    } = newData;

    try {
      // Get the first period to determine the next review date
      const period = await Period.findOne().sort({ step: 1 });
      if (!period) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "You need to create a period first before creating a new word",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
      }

      // Calculate the next review date
      const nextReviewDate = dayjs.utc().add(period.nextViewDay, 'day').toDate();

      const newData = {
        title,
        keyWord,
        pronounciation,
        definition,
        description,
        lessonId,
        topicId,
        images,
        sounds,
        examples,
        userId: createdUserId,
        nextReviewDate
      };

      const createdData = await Word.create(newData);

      if (createdData) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "Created  successfully",
          typeError: "",
          data: createdData,
          statusMessage: "Success",
        });
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.INVALID.status,
        message: "Error when creating",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        data: null,
        statusMessage: "Error",
      });
    } catch (error) {
      console.log("createWord ~ error:", error)

      reject(error);
    }
  });
};

// filter, sort
const getWords = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {useReviewToday, sort, filter, limit, page} = req.query;

      let query = filter ? JSON.parse(filter) : {};
      let sortCondition = {};

      // pagination
      const calcLimit = +limit || DEFAULT_PAGE_SIZE;
      const calcPage = +page || DEFAULT_PAGE;
      const skip = (calcPage - 1) * calcLimit;

      // Sort data
      if (sort) {
        const parsedSort = JSON.parse(sort);
        Object.keys(parsedSort).forEach((key) => {
          sortCondition[key] = parsedSort[key] === 'asc' ? 1 : -1;
        });
      }

        // Get all words that need to be reviewed less than or equal to today
      if (useReviewToday === ENABLE_USE_REVIEW_TODAY) {
        const todayUTC = dayjs.utc().endOf('day');
        query = { ...query ,nextReviewDate: { $lte: todayUTC.toDate() } };
      }

      // search by regex with some fields
      const searchFields = ["title", "keyWord", "definition"];
      searchFields.forEach((field) => {
        if (query[field]) {
          query[field] = { $regex: query[field]?.trim() || "", $options: "i" };
        }
      });

      const loggedInUser = req.user._id;
      query = { ...query, userId: loggedInUser };

      const result = await Word.aggregate([
        { $match: query },
        {
          $facet: {
            words: [
              { $sort: sortCondition },  // sort
              { $skip: skip },        
              { $limit: calcLimit }      
            ],
            totalCount: [
              { $count: "count" }    // Count total documents
            ]
          }
        }
      ]);

      const data = {
        list: result[0].words || [],
        totalCount: result[0].totalCount?.[0]?.count || 0
      };


      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Get data successfully",
        data,
        statusMessage: "Success",
      });
    } catch (error) {
      console.log("getWords ~ error:", error)
      reject(error);
    }
  });
};

const updateOnlyInfoWord = (updatedData = {}, updateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the word is existed
      const checkWord = await Word.findById(updateId);
      if (!checkWord) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The word is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      // Don't update nextReviewDate, reviewCount, step, reviewHistory
      delete updatedData.nextReviewDate;
      delete updatedData.reviewCount;
      delete updatedData.step;
      delete updatedData.reviewHistory;

      // Modify fields
      Object.assign(checkWord, updatedData);
      // Save the updated document
      await checkWord.save();

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: checkWord,
        statusMessage: "Success",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  create,
  getWords,
  updateOnlyInfoWord
};
