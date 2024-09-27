/* eslint-disable no-async-promise-executor */
const bcrypt = require("bcrypt");
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const User = require("../models/UserModel");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, name, avatar } =
      newUser;

    try {
      const existedUser = await User.findOne({
        email: email,
      });

      // is existed
      if (existedUser !== null) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.status,
          message: "The email of user is existed",
          typeError: CONFIG_MESSAGE_ERRORS.ALREADY_EXIST.type,
          data: null,
          statusMessage: "Error",
        });
      }

      const hash = bcrypt.hashSync(password, 10);
      const userCreate = {
        email,
        password: hash,
        name,
        avatar,
      };

      const createdUser = await User.create(userCreate);

      if (createdUser) {
        return resolve({
          status: CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status,
          message: "Created user success",
          typeError: "",
          data: createdUser,
          statusMessage: "Success",
        });
      }
      
      return resolve({
        status: CONFIG_MESSAGE_ERRORS.INVALID.status,
        message: "Error when create user",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        data: null,
        statusMessage: "Error",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getUsers = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const loggedInUser = req.user._id;
      
      // Get all users except logged in user
      const users = await User.find({ _id: { $ne: loggedInUser } });
      
      return resolve({
        status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status,
        message: "Get users success",
        data: users,
        statusMessage: "Success",
      });
    } catch (error) {
      // console.log("returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};



module.exports = {
  createUser,
  getUsers,
};
