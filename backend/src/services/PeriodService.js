/* eslint-disable no-async-promise-executor */
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const Period = require("../models/period.model");

const create = (newData) => {
  return new Promise(async (resolve, reject) => {
    const { name, nextViewDay, step } = newData;

    try {
      const newDatas = {
        name,
        nextViewDay,
        step,
      };

      const createdData = await Period.create(newDatas);

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
      const data = await Period.find({});

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

const update = (updatedData = {}, updateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPeriod = await Period.findById(updateId);

      if (!checkPeriod) {
        resolve({
          status: CONFIG_MESSAGE_ERRORS.INVALID.status,
          message: "The period is not existed",
          typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
          data: null,
          statusMessage: "Error",
        });
        return;
      }

      // Modify fields
      Object.assign(checkPeriod, updatedData);
      // Save the updated document
      await checkPeriod.save();

      return resolve({
        status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
        message: "updated successfully",
        typeError: "",
        data: checkPeriod,
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
};
