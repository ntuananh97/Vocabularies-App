const { validateRequiredInput } = require("../utils");
const PeriodService = require("../services/PeriodService");

const { returnInternalErrorResponse, returnInvalidErrorResponse } = require("../utils/returnResponse");

const createPeriod = async (req, res) => {
  // validate
  try {
    const requiredFields = validateRequiredInput(req.body, [
      "name",
      "nextViewDay",
      "step",
    ]);

    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field [${requiredFields[0]}] is required`,
      });
    }

    const response = await PeriodService.create(req.body);
    const { data, status, typeError, message, statusMessage } = response;

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

const getPeriods = async (req, res) => {
  try {
    const response = await PeriodService.getList(req, res);
    const { data, status,  message } = response;
    
 
    return res.status(status).json({
      data,
      message,
    });
  } catch (error) {
    console.log("get Period ~ error:", error.message)
    return returnInternalErrorResponse(res, {error: error.message});
  }
};

const updatePeriod = async (req, res) => {
  try {
    const updateId = req.params.id;

    const response = await PeriodService.update(req.body, updateId);
    const { data, status, typeError, message, statusMessage } = response;

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


module.exports = {
  createPeriod,
  getPeriods,
  updatePeriod
};
