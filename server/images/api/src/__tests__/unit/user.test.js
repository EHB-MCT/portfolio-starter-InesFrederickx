const {
  checkUserUsername,
  checkUserEmail,
  checkUserPassword,
} = require("../../helpers/userEndpointHelpers");

// table.increments("user_id").primary();
// table.string("username", 50).notNullable();
// table.string("email", 50).notNullable().unique();
// table.string("password", 255).notNullable();
// table
//   .enu("role", ["student", "teacher", "admin"], {
//     useNative: true,
//     enumName: "user_role",
//   })
//   .notNullable();

describe("checkUserUsername", () => {
  test("should return false for invalid inputs", () => {
    expect(checkUserUsername("")).toBe(false);
    expect(checkUserUsername(null)).toBe(false);
    expect(checkUserUsername(1)).toBe(false);
    expect(checkUserUsername("i")).toBe(false);
    expect(checkUserUsername("thisisausernamethatiswaytoolong")).toBe(false);
    expect(checkUserUsername("user@name!")).toBe(false);
    expect(checkUserUsername("    ")).toBe(false);
    expect(checkUserUsername("user  name")).toBe(false);
    expect(checkUserUsername("user   name")).toBe(false);
  });

  test("should return false for usernames with invalid characters", () => {
    const invalidChars = [
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "!",
      "=",
      "+",
      "{",
      "}",
      "[",
      "]",
      "|",
      "\\",
      ":",
      ";",
      "'",
      '"',
      "<",
      ">",
      ",",
      ".",
      "?",
      "/",
      "_",
    ];
    invalidChars.forEach((char) => {
      expect(checkUserUsername(`user${char}name`)).toBe(false);
    });
  });

  test("should return true for valid usernames", () => {
    expect(checkUserUsername("validUser")).toBe(true);
    expect(checkUserUsername("user name")).toBe(true);
    expect(checkUserUsername("username")).toBe(true);
    expect(checkUserUsername("username-with-dashes")).toBe(true);
  });
});

describe("checkUserEmail", () => {
  test("should return false for invalid inputs", () => {
    expect(checkUserEmail("")).toBe(false);
    expect(checkUserEmail(null)).toBe(false);
    expect(checkUserEmail(1)).toBe(false);
    expect(checkUserEmail("plainaddress")).toBe(false);
    expect(checkUserEmail("missingdomain@.com")).toBe(false);
    expect(checkUserEmail("missing@tld")).toBe(false);
    expect(checkUserEmail("user@domain..com")).toBe(false);
    expect(checkUserEmail("user@domain.c")).toBe(false);
    expect(checkUserEmail("user@domain@domain.com")).toBe(false);
    expect(checkUserEmail("user@ domain.com")).toBe(false);
    expect(checkUserEmail("user@notallowed.com")).toBe(false);
    expect(checkUserEmail("user@ehb.be.extra")).toBe(false);
  });

  test("should return true for valid email addresses", () => {
    expect(checkUserEmail("user@student.ehb.be")).toBe(true);
    expect(checkUserEmail("user@ehb.be")).toBe(true);
    expect(checkUserEmail("user.name@student.ehb.be")).toBe(true);
    expect(checkUserEmail("user-name@student.ehb.be")).toBe(true);
    expect(checkUserEmail("user.name@ehb.be")).toBe(true);
    expect(checkUserEmail("user-name@ehb.be")).toBe(true);
  });
});

describe("checkUserPassword", () => {
  test("should return false for invalid inputs", () => {
    expect(checkUserPassword("")).toBe(false);
    expect(checkUserPassword(null)).toBe(false);
    expect(checkUserPassword(12345678)).toBe(false);
    expect(checkUserPassword("short")).toBe(false);
    expect(checkUserPassword("longpasswordwithoutnumbers!")).toBe(false);
    expect(checkUserPassword("12345678")).toBe(false);
    expect(checkUserPassword("PASSWORD123")).toBe(false);
    expect(checkUserPassword("Password!")).toBe(false);
    expect(checkUserPassword("Pass1234")).toBe(false);
    expect(checkUserPassword("!@#$%^&*()_+")).toBe(false);
    expect(checkUserPassword("password password1!")).toBe(false);
  });

  test("should return true for valid passwords", () => {
    expect(checkUserPassword("Password1!")).toBe(true);
    expect(checkUserPassword("P@ssw0rd!")).toBe(true);
    expect(checkUserPassword("MySecureP@ss1")).toBe(true);
    expect(checkUserPassword("Valid123!")).toBe(true);
  });
});
