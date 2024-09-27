const jwt = require("jsonwebtoken");
const process = require("process");
const { TOKEN_NAME } = require("../configs/constants");


const generateAuthToken = (payload = {}) => {
  const token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
  return token;
};

/**
 * Generates an authentication token and set cookie.
 * @param {{userId: string}} payload - The payload to be included in the token.
 */
const generateTokenAndSetCookie = (payload, res) => {
  const token = generateAuthToken(payload);
  
  res.cookie(TOKEN_NAME, token, {
    httpOnly: true,
    secure: false,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict",
  });
};

module.exports = {
    generateAuthToken,
    generateTokenAndSetCookie,
}
