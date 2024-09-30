const dayjs = require("dayjs");

const getDateQuery = (field, data) => {
    let dateQuery = {};
    const fieldValue = data[field];

    if (!fieldValue) return dateQuery;

    const [fromDate, toDate] = fieldValue.split(",");

    if (fromDate) dateQuery = { ...dateQuery, $gte: dayjs.utc(fromDate).toDate() };
    if (toDate) dateQuery = { ...dateQuery, $lte: dayjs.utc(toDate).toDate() };

    return {
        [field]: dateQuery,
    };
}

module.exports = {
    getDateQuery
};