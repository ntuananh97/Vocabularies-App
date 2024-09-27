/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Lesson = require("../models/lesson.model");

const create = (newData, createdUserId) => {
  return new Promise(async (resolve, reject) => {
    const { name } =
    newData;

    try {

      const newLesson = {
        name,
        userId: createdUserId,
      };

      const createdLesson = await Lesson.create(newLesson);

      if (createdLesson) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "Created lesson success",
          typeError: "",
          data: createdLesson,
          statusMessage: "Success",
        });
      }
      
      return resolve({
        status: CONFIG_MESSAGE_ERRORS.INVALID.status,
        message: "Error when create lesson",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        data: null,
        statusMessage: "Error",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getLessons = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const loggedInUser = req.user._id;
      
      // Get all lessons of user
      const lessons = await Lesson.find({ userId: loggedInUser });
      
      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Get lessons success",
        data: lessons,
        statusMessage: "Success",
      });
    } catch (error) {
      // console.log("returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};



module.exports = {
  create,
  getLessons,
};
