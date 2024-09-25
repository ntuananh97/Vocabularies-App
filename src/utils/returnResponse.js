
const { CONFIG_MESSAGE_ERRORS } = require("../configs/constants");

const returnInternalErrorResponse = (res, payload = {}) => {
  // console.log("returnInternalErrorResponse ~ payload:", payload)
  res.status(CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.status).json({
    message: "Internal Server Error",
    data: null,
    status: "Error",
    typeError: CONFIG_MESSAGE_ERRORS.INTERNAL_ERROR.type,
    ...payload
  });
};


/**
 * 
 * @param {{
 * message: string, 
 * data: any,
 * }} payload - The response object.
 */
const returnInvalidErrorResponse = (res, payload = {}) => {
    res.status(CONFIG_MESSAGE_ERRORS.INVALID.status).json({
    message: "Invalid Request",
    data: null,
    status: "Error",
    typeError: CONFIG_MESSAGE_ERRORS.INVALID.type,
    ...payload
  });
};

/**
 * 
 * @param {{
 * message: string, 
 * data: any,
 * }} payload - The response object.
 */
const returnActionSuccessResponse = (res, payload = {}) => {
    res.status(CONFIG_MESSAGE_ERRORS.ACTION_SUCCESS.status).json({
    message: "Created Successfully",
    status: "Success",
    ...payload
  });
};

/**
 * 
 * @param {{
 * message: string, 
 * data: any,
 * }} payload - The response object.
 */
const returnGetSuccessResponse = (res, payload = {}) => {
    res.status(CONFIG_MESSAGE_ERRORS.GET_SUCCESS.status).json({
    message: "Get Successfully",
    status: "Success",
    ...payload
  });
};

/**
 * 
 * @param {{
* message: string, 
* data: any,
* }} payload - The response object.
*/
const returnUnauthorizedErrorResponse = (res, payload = {}) => {
  res.status(CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.status).json({
   status: "Error",
   message: "Unauthorized",
   typeError: CONFIG_MESSAGE_ERRORS.UNAUTHORIZED.type,
   ...payload
 });
};

module.exports = { 
  returnInternalErrorResponse, 
  returnInvalidErrorResponse,
  returnActionSuccessResponse,
  returnGetSuccessResponse,
  returnUnauthorizedErrorResponse,
};
