const { checkReplyContent } = require("../../helpers/replyEndpointHelpers");

describe("checkReplyContent", () => {
  test("should return false for invalid inputs", () => {
    expect(checkReplyContent("")).toBe(false);
    expect(checkReplyContent(null)).toBe(false);
    expect(checkReplyContent(1234567890)).toBe(false);
    expect(checkReplyContent("i")).toBe(false);
    expect(checkReplyContent("a".repeat(501))).toBe(false);
  });

  test("should return true for valid content", () => {
    expect(
      checkReplyContent("Valid reply content with spaces and punctuation.")
    ).toBe(true);
    expect(
      checkReplyContent(
        "This is a longer reply content that should still be valid as long as it does not exceed the maximum length."
      )
    ).toBe(true);
    expect(checkReplyContent("Short reply")).toBe(true);
    expect(
      checkReplyContent(
        "Another valid reply content with special characters like !@#$%^&*()"
      )
    ).toBe(true);
  });
});
