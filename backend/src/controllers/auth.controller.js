const { CONFIG_MESSAGE_ERRORS, TOKEN_NAME } = require("../configs/constants");
const User = require("../models/UserModel");
const { generateTokenAndSetCookie } = require("../utils/generateToken");
const { returnInternalErrorResponse } = require("../utils/returnResponse");
const bcrypt = require("bcrypt");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

    if (!user || !isPasswordCorrect) {
      return res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
        message: "email or password is incorrect",
        typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
      });
    };

    generateTokenAndSetCookie({ userId: user._id }, res);

    return res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
      message: "Login successfully",
      data: user,
      status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.type,
    });
    
  } catch (error) {
    console.log("error in login", error);
    return returnInternalErrorResponse(res);

  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(TOKEN_NAME, { httpOnly: true, secure: true, path: '/' });

    return res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
      message: "Logout successfully",
      status: CONFIG_MESSAGE_ERRORS.GET_SUCCESS.type,
    });
    
  } catch (error) {
    console.log("error in logout", error);
    return returnInternalErrorResponse(res);

  }
};

module.exports = {
  login,
  logout
};
