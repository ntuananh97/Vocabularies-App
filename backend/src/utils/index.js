const { default: mongoose } = require("mongoose");

// Only validate the string fields that are required
const validateRequiredInput = (data, arrRequired) => {
  const missingFields = arrRequired.filter(
    (field) => {
      if (typeof data[field] === "string") {
        return !data[field].trim();
      }

      return !data[field] && data[field] !== 0;
    }
  );
  return missingFields;
};

// a function that check if the required field has a value but it's empty
const checkEmptyRequiredFields = (data, arrRequired) => {
  const emptyRequiredFields = arrRequired.filter(
    (field) => typeof data[field] === "string" && data[field].trim() === ""
  );
  return emptyRequiredFields;
};

const convertStringToObjectId = (str) => {
  const newString = new mongoose.Types.ObjectId(str)
  return newString
};


module.exports = {
  validateRequiredInput,
  checkEmptyRequiredFields,
  convertStringToObjectId
};
