/**
 * Check name of new user on post
 *
 * @param {string} username - The username to validate.
 * @returns {boolean} false if no match, true if valid format.
 */
function checkUserUsername(name) {
  if (name == null || typeof name !== "string") {
    return false;
  }

  const trimmedName = name.trim();

  const validUsernamePattern = /^[a-zA-Z0-9-]+(?: [a-zA-Z0-9-]+)*$/;

  if (
    name.length < 2 ||
    name.length > 20 ||
    !validUsernamePattern.test(trimmedName) ||
    name.trim() === ""
  ) {
    return false;
  }

  return true;
}

/**
 * Check email validity
 *
 * @param {string} email - The email to validate.
 * @returns {boolean} false if no match, true if valid format.
 */
function checkUserEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@(student\.ehb\.be|ehb\.be)$/;

  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    !emailPattern.test(email)
  ) {
    return false;
  }

  return true;
}

/**
 * Check password validity
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} false if no match, true if valid format.
 */
function checkUserPassword(password) {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  if (
    typeof password !== "string" ||
    password.trim() === "" ||
    !passwordPattern.test(password)
  ) {
    return false;
  }

  return true;
}

module.exports = {
  checkUserUsername,
  checkUserEmail,
  checkUserPassword,
};
