/**
 * Check title of a thread
 *
@param {string} title - The title to validate.
 * @returns {boolean} false if no match, true if valid format.
 */
function checkThreadTitle(title) {
  if (title == null || typeof title !== "string") {
    return false;
  }

  const trimmedTitle = title.trim();

  const validTitlePattern = /^[a-zA-Z0-9\-_.!@]+(?: [a-zA-Z0-9\-_.!@]+)*$/;

  if (
    trimmedTitle.length < 3 ||
    trimmedTitle.length > 100 ||
    !validTitlePattern.test(trimmedTitle) ||
    /\s{2,}/.test(trimmedTitle)
  ) {
    return false;
  }

  return true;
}

/**
 * Check content of a thread
 *
@param {string} content - The content to validate.
 * @returns {boolean} false if no match, true if valid format.
 */
function checkThreadContent(content) {
  if (content == null || typeof content !== "string") {
    return false;
  }

  const trimmedContent = content.trim();
  if (
    trimmedContent.length < 10 ||
    trimmedContent.length > 1000 ||
    trimmedContent === ""
  ) {
    return false;
  }

  return true;
}

module.exports = {
  checkThreadTitle,
  checkThreadContent,
};
