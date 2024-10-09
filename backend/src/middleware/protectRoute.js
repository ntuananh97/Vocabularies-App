const { TOKEN_NAME, CONFIG_MESSAGE_ERRORS } = require("../configs/constants");
const User = require("../models/UserModel");
const { returnInternalErrorResponse, returnUnauthorizedErrorResponse } = require("../utils/returnResponse");
const jwt = require("jsonwebtoken");
const process = require("process");

const handleUnauthorizedError = (res) => {
  returnUnauthorizedErrorResponse(res, {message: "Unauthorized - Invalid Token"});
}

const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookie and check if it exists
    const token = req.cookies[TOKEN_NAME];
    console.log("protectRoute ~ token:", token)

    if (!token) {
      return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
        message: "Unauthorized - No Token Provided",
        typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
      });
    }

    // Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
      return handleUnauthorizedError(res);
    }
    console.log("protectRoute ~ decoded:", decoded)

    if (!decoded) { // If token is invalid
      return handleUnauthorizedError(res);
    }

    // Check user in database
    const user = await User.findById(decoded.userId, "name email avatar").select("-password");
    console.log("protectRoute ~ user:", user)

    // Check if user is authenticated
    if (!user) {
      return res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
        message: "Unauthorized - User not found",
        typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
      });
    }

    // Add user object to req
    req.user = user
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    return returnInternalErrorResponse(res, {error});
  }
};

module.exports = protectRoute;
