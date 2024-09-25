/* eslint-disable no-async-promise-executor */

const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const dayjs = require('dayjs');
const Word = require('../models/word.model');
const Period = require('../models/period.model');


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

const getWords = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("getWords ~ req:", req.query);
      const {useReviewToday, sort} = req.query;
      console.log("returnnewPromise ~ sort:", sort)

      let query = {};
      let sortCondition = {};

      // Sort data
      if (sort) {
        const parsedSort = JSON.parse(sort);
        Object.keys(parsedSort).forEach((key) => {
          console.log("Object.keys ~ key:", key, parsedSort[key])
          sortCondition[key] = parsedSort[key] === 'asc' ? 1 : -1;
        });
        console.log("returnnewPromise ~ sortCondition:", parsedSort, sortCondition)
      }

        // Get all words that need to be reviewed less than or equal to today
      if (useReviewToday === "1") {
        const todayUTC = dayjs.utc().endOf('day');
        console.log("returnnewPromise ~ todayUTC:", dayjs(todayUTC).format('YYYY-MM-DD HH:mm:ss'));

        query = { nextReviewDate: { $lte: todayUTC.toDate() } };
      }

      const loggedInUser = req.user._id;


      // Get all data of user
      const data = await Word.find({ userId: loggedInUser, ...query }).sort(sortCondition);

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

module.exports = {
  create,
  getWords,
};
