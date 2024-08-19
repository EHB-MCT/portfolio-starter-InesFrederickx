const {
  checkThreadTitle,
  checkThreadContent,
} = require("../../helpers/threadEndpointHelpers");

describe("checkThreadTitle", () => {
  test("should return false for invalid inputs", () => {
    expect(checkThreadTitle("")).toBe(false);
    expect(checkThreadTitle(null)).toBe(false);
    expect(checkThreadTitle(12345)).toBe(false);
    expect(checkThreadTitle("ab")).toBe(false);
    expect(checkThreadTitle("a".repeat(101))).toBe(false);
    expect(checkThreadTitle("!@#$%^&*()")).toBe(false);
    expect(checkThreadTitle("thread with    multiple spaces")).toBe(false);
  });

  test("should return true for valid titles", () => {
    expect(checkThreadTitle("Valid Thread Title")).toBe(true);
    expect(checkThreadTitle("Short Title")).toBe(true);
    expect(checkThreadTitle("A bit longer but still valid title!")).toBe(true);
    expect(checkThreadTitle("Thread Title With_Valid_Characters")).toBe(true);
  });
});

describe("checkThreadContent", () => {
  test("should return false for invalid inputs", () => {
    expect(checkThreadContent("")).toBe(false);
    expect(checkThreadContent(null)).toBe(false);
    expect(checkThreadContent(1234567890)).toBe(false);
    expect(checkThreadContent("short")).toBe(false);
    expect(checkThreadContent("a".repeat(1001))).toBe(false);
  });

  test("should return true for valid content", () => {
    expect(
      checkThreadContent("Valid content with spaces and punctuation.")
    ).toBe(true);
    expect(
      checkThreadContent(
        "This is a longer content string that should still be valid as long as it does not exceed the maximum length."
      )
    ).toBe(true);
    expect(checkThreadContent("Short content")).toBe(true);
    expect(
      checkThreadContent(
        "Another valid content with special characters like !@#$%^&*()"
      )
    ).toBe(true);
  });
});
