/* eslint-disable no-async-promise-executor */

const { CONFIG_MESSAGE_ERRORS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE } = require("../configs/constants");
const dayjs = require('dayjs');
const Word = require('../models/word.model');
const Period = require('../models/period.model');
const { convertStringToObjectId } = require("../utils");
const { getDateQuery } = require("../utils/convertDate");

const ENABLE_USE_REVIEW_TODAY = "1";


const create = (bodyData, createdUserId) => {
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
    } = bodyData;

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
        images,
        sounds,
        examples,
        userId: createdUserId,
        nextReviewDate
      };

      if (lessonId) newData.lessonId = convertStringToObjectId(lessonId);
      if (topicId) newData.topicId = convertStringToObjectId(topicId);

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

      // convert string to number for some fields
      const stringToNumberFileds = ["step", "reviewCount"];
      stringToNumberFileds.forEach((field) => {
        if (query[field]) query[field] = +query[field];
      });

      // convert some fields to ObjectId
      const stringToObjectIdFileds = ["topicId", "lessonId"];
      stringToObjectIdFileds.forEach((field) => {
        if (query[field]) query[field] = convertStringToObjectId(query[field]);
      });

      // Convert createdAt
      const createdAt = getDateQuery("createdAt", query);
      const updatedAt = getDateQuery("updatedAt", query);

      const loggedInUser = req.user._id;
      query = { ...query, userId: loggedInUser, ...createdAt, ...updatedAt };

      const wordsQuery = [
        { $match: query },
      ]

      if (Object.keys(sortCondition).length > 0) {
        wordsQuery.push({ $sort: sortCondition });
      }

      const result = await Word.aggregate([
        ...wordsQuery,
        {
          $facet: {
            words: [
              { $skip: skip },        
              { $limit: calcLimit },    
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

      const {lessonId, topicId} = updatedData;

      if (lessonId) updatedData.lessonId = convertStringToObjectId(lessonId);
      if (topicId) updatedData.topicId = convertStringToObjectId(topicId);

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

const markAsReviewed = (updateId) => {
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

      const currentStep = checkWord.step;
      // Get period of the next step
      let nextPeriod = await Period.findOne({ step: currentStep + 1 });

      // If the next step is not existed, get the period of the current step
      if (!nextPeriod) {
        nextPeriod = await Period.findOne({ step: currentStep });
      }

      // Recalculate nextReviewDate, reviewCount, step, reviewHistory
      const nextViewDay = nextPeriod.nextViewDay;
      const nextReviewDate = dayjs.utc().add(nextViewDay, 'day').toDate();
      const reviewCount = checkWord.reviewCount + 1;
      const step = nextPeriod.step;
      const reviewHistory = [...checkWord.reviewHistory, {
        reviewDate: dayjs.utc().toDate(),
        step: currentStep
      }];

      const updatedData = {
        nextReviewDate,
        reviewCount,
        step,
        reviewHistory
      };

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

const getDetailWord = (updateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the word is existed
      const wordInfo = await Word.findById(updateId).populate("lessonId");
      if (!wordInfo) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The word is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      // keep lessonId and populate value to lesson
      if (wordInfo.lessonId) {
        wordInfo.lesson = wordInfo.lessonId;
      }

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: wordInfo,
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
  updateOnlyInfoWord,
  markAsReviewed,
  getDetailWord
};
