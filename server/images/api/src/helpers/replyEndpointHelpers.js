/**
 * Check content of a reply
 *
 * @param: content
 * @returns: false if no match, true if right type
 */
function checkReplyContent(content) {
  if (content == null || typeof content !== "string") {
    return false;
  }

  const trimmedContent = content.trim();

  if (
    trimmedContent.length < 2 ||
    trimmedContent.length > 500 ||
    trimmedContent === ""
  ) {
    return false;
  }

  return true;
}

module.exports = {
  checkReplyContent,
};
