const path = require("path");

const getOriginalFileNameFromFileName = (fileName) => {
  const originalFileName = path.parse(fileName).name;
  const timestamp = Date.now();
  return `${timestamp}_${originalFileName}`;
};

module.exports = {
  getOriginalFileNameFromFileName,
};
