const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const REGEX_PHONE = /^[0-9]{9,}$/;

/**
 * Validates if the provided email string matches the email format.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns `true` if the email is valid, `false` otherwise.
 */
const isValidMail = (email) => REGEX_EMAIL.test(email);

/**
 * The password must be at least 6 characters long and include uppercase letters,
 * lowercase letters, numbers, and special characters.
 *
 * @param {string} password 
 * @returns {boolean} 
 */
const isValidPassword = (password) => REGEX_PASSWORD.test(password);

/**
 * Phone number must not contain letters and must be at least 9 numbers
 *
 * @param {string} phoneNumber 
 * @returns {boolean} 
 */
const isValidPhoneNumber = (phoneNumber) => REGEX_PHONE.test(phoneNumber);

module.exports = {
    isValidMail,
    isValidPassword,
    isValidPhoneNumber
};
