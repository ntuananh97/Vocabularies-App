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



module.exports = {
  validateRequiredInput,
};
