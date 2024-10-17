/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Lesson = require("../models/lesson.model");
const { calcPagination, getSortCondition } = require("../utils/query");

const create = (newData, createdUserId) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newData;

    try {

      const newLesson = {
        name,
        userId: createdUserId,
      };

      const checkExistGroup = await Lesson.findOne({ name , userId: createdUserId });
      if (checkExistGroup) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "The group is existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

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
      const {sort, filter, limit, page} = req.query;
      let query = filter ? JSON.parse(filter) : {};
      query.userId = loggedInUser;

      const {calcLimit, skip} = calcPagination(page, limit);
      const sortCondition = getSortCondition(sort);

       // search by regex with some fields
       const searchFields = ["name"];
       searchFields.forEach((field) => {
         if (query[field]) {
           query[field] = { $regex: query[field]?.trim() || "", $options: "i" };
         }
       });

      
      const lessonsQuery = [
        { $match: query },
      ]
      if (Object.keys(sortCondition).length > 0) {
        lessonsQuery.push({ $sort: sortCondition });
      }

      const result = await Lesson.aggregate([
        ...lessonsQuery,
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
        message: "Get lessons success",
        data,
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
