const { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } = require("../configs/constants");

/**
 * Calculates pagination parameters.
 *
 * @param {[string | number]} page - The current page number.
 * @param {[string | number]} limit - The number of items per page.
 * @returns {Object} An object containing the calculated skip and limit values.
 * @returns {number} return.skip - The number of items to skip.
 * @returns {number} return.calcLimit - The number of items per page.
 */
const calcPagination = (page, limit) => {
  const calcLimit = limit !== undefined ? +limit : DEFAULT_PAGE_SIZE;
  const calcPage = page !== undefined ? +page : DEFAULT_PAGE;
  const skip = (calcPage - 1) * calcLimit;
  return { skip, calcLimit };
};

/**
 * Converts a comma-separated string of attributes into an object with each attribute as a key and a value of 1.
 *
 * @param {[string]} attributes - A comma-separated string of attributes.
 * @returns {Object} An object where each key is an attribute from the input string and the value is 1.
 */
const getAttributesForQuery = (attributes) => {
  if (!attributes) return {};
  return attributes.split(",").reduce((acc, item) => {
    acc[item] = 1;
    return acc;
  }, {});
};

/**
 * Generates a MongoDB sort condition object from a JSON string.
 *
 * @param {string} sort - A JSON string representing the sort conditions.
 *                        The keys are the field names and the values are either 'asc' or 'desc'.
 * @returns {Object} A MongoDB sort condition object where the keys are the field names and the values are 1 for ascending and -1 for descending.
 */
const getSortCondition = (sort) => {
  const sortCondition = {};
  if (sort) {
    const parsedSort = JSON.parse(sort);
    Object.keys(parsedSort).forEach((key) => {
      sortCondition[key] = parsedSort[key] === "asc" ? 1 : -1;
    });
  }
  return sortCondition;
};

module.exports = {
  calcPagination,
  getAttributesForQuery,
  getSortCondition,
};
