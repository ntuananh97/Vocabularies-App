const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const { validateRequiredInput } = require("../utils");
const {generateTokenAndSetCookie} = require("../utils/generateToken");
const UserService = require("../services/UserService");
const {
  isValidMail,
} = require("../utils/regex");
const { returnInternalErrorResponse, returnGetSuccessResponse } = require("../utils/returnResponse");

const createUser = async (req, res) => {
  // validate
  try {
    const { email } = req.body;
    const requiredFields = validateRequiredInput(req.body, [
      "email",
      "password",
      "name",
    ]);

    if (requiredFields.length > 0) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "Error",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        message: `The field [${requiredFields[0]}] is required`,
      });
    }

    if (!isValidMail(email)) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        status: "INVALID",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
        message: "The field must a email",
      });
    }


    // if (!isValidPassword(password)) {
    //   return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
    //     status: "Error",
    //     typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
    //     message:
    //       'The password must be at least 6 characters long and include uppercase letters, lowercase letters, numbers, and special characters."',
    //   });
    // }

    const response = await UserService.createUser(req.body);
    const { data, status, typeError, message, statusMessage } = response;
    
    if (status === CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status) {
      generateTokenAndSetCookie({userId: data._id}, res);
    }
    return res.status(status).json({
      typeError,
      data,
      message,
      status: statusMessage,
    });
  } catch {
    return returnInternalErrorResponse(res);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await UserService.getUsers(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("getUsers ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const getCurrentUser = async (req, res) => {
  return returnGetSuccessResponse(res, {data: req.user});
};

module.exports = {
  createUser,
  getUsers,
  getCurrentUser
};
