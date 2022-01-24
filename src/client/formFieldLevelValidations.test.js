import {
  emailIsRequired,
  firstNameNotBlank,
  firstNameRequired,
  firstReviewerRequired,
  isEmail,
  isIntegerString,
  isPhoneNumber,
  isPIBControlNumber,
  lastNameNotBlank,
  lastNameRequired,
  notFutureDate,
  pibControlNumberNotBlank,
  pibControlNumberRequired,
  secondReviewerRequired,
  reviewersShouldBeDifferent,
  validDate
} from "./formFieldLevelValidations";
import moment from "moment";
import { ISO_DATE } from "../sharedUtilities/constants";
const {
  BUREAU_ACRONYM
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("Form Validations", () => {
  test("firstNameRequired should return an error message when undefined", () => {
    expect(firstNameRequired()).toEqual("Please enter First Name");
  });
  test("firstNameRequired should not return an error message when a name is submitted", () => {
    expect(firstNameRequired("Archibald")).toBeUndefined();
  });

  test("lastNameRequired should return an error message when undefined", () => {
    expect(lastNameRequired()).toEqual("Please enter Last Name");
  });
  test("lastNameRequired should not return an error message when a name is submitted", () => {
    expect(lastNameRequired("Friedreichsdottir")).toBeUndefined();
  });

  test("firstNameRequired should return an error message when blank", () => {
    expect(firstNameNotBlank("")).toEqual("Please enter First Name");
    expect(firstNameNotBlank("\n")).toEqual("Please enter First Name");
  });
  test("firstNameRequired should not return an error message when a name is submitted", () => {
    expect(firstNameNotBlank("Ulysses")).toBeUndefined();
  });

  test("lastNameRequired should return an error message when blank", () => {
    expect(lastNameNotBlank("")).toEqual("Please enter Last Name");
    expect(lastNameNotBlank("\n")).toEqual("Please enter Last Name");
  });
  test("lastNameRequired should not return an error message when a name is submitted", () => {
    expect(lastNameNotBlank("Kozakiewicz")).toBeUndefined();
  });

  test("isEmail should return an error message when not in something@domain.suffix format", () => {
    expect(isEmail("bad-email")).toEqual("Please enter a valid email address");
  });
  test("isEmail should not return an error message when in something@domain.suffix format", () => {
    expect(isEmail("email@domain.edu")).toBeUndefined();
  });

  test("isEmail should not run on empty falsy values", () => {
    expect(isEmail(null)).toBeUndefined();
    expect(isEmail("")).toBeUndefined();
    expect(isEmail(undefined)).toBeUndefined();
  });

  test("isPhoneNumber should return an error message when not 10 digit format", () => {
    expect(isPhoneNumber("123456789")).toEqual(
      "Please enter a numeric 10 digit value"
    );
    expect(isPhoneNumber("12345678901")).toEqual(
      "Please enter a numeric 10 digit value"
    );
  });
  test("isPhoneNumber should not return an error message when has 10 digits", () => {
    expect(isPhoneNumber("3134655245")).toBeUndefined();
  });

  test("isPhoneNumber should not run on empty falsy values", () => {
    expect(isPhoneNumber(null)).toBeUndefined();
    expect(isPhoneNumber("")).toBeUndefined();
    expect(isPhoneNumber(undefined)).toBeUndefined();
  });

  test("isPIBControlNumber should not return an error message when is valid", () => {
    expect(isPIBControlNumber("2019-0001-P")).toBeUndefined();
  });

  test("isPIBControlNumber should not run on empty falsy values", () => {
    expect(isPIBControlNumber(null)).toBeUndefined();
    expect(isPIBControlNumber("")).toBeUndefined();
    expect(isPIBControlNumber(undefined)).toBeUndefined();
  });

  test("pibControlNumberRequired should return an error when the control number is not provided", () => {
    expect(pibControlNumberRequired()).toEqual(
      `Please enter a ${BUREAU_ACRONYM} Control #`
    );
  });

  test("pibControlNumberNotBlank should return an error when the control number is empty", () => {
    expect(pibControlNumberNotBlank("   ")).toEqual(
      `Please enter a ${BUREAU_ACRONYM} Control #`
    );
  });
  test("emailRequired should return an error when email is not provided", () => {
    expect(emailIsRequired()).toEqual("Please enter Email Address");
  });
  test("firstReviewerRequired should return an error when first reviewer is empty", () => {
    expect(firstReviewerRequired()).toEqual("Please select a First Reviewer");
  });
  test("secondReviewerRequired should return an error when second reviewer is empty", () => {
    expect(secondReviewerRequired()).toEqual("Please select a Second Reviewer");
  });

  test("reviewersShouldBeDifferent returns an error when reviewers are the same", () => {
    expect(
      reviewersShouldBeDifferent("migos@three.com", {
        firstReviewer: "migos@three.com",
        secondReviewer: "migos@three.com"
      })
    ).toEqual(
      "You’ve selected the same user for both Reviewers. Please change one."
    );
  });

  test("notFutureDate should return an error when date is a future date", () => {
    const today = moment(Date.now()).add(1, "days").format(ISO_DATE);
    expect(notFutureDate(today)).toEqual("Date cannot be in the future");
  });

  test("isIntegerString returns an error when string given", () => {
    expect(isIntegerString("abc")).toEqual("Please enter a number");
  });

  test("isIntegerString returns an error when decimal given", () => {
    expect(isIntegerString(5.5)).toEqual("Please enter a number");
    expect(isIntegerString("2.7")).toEqual("Please enter a number");
  });

  test("isIntegerString returns an error when string boolean given", () => {
    expect(isIntegerString("false")).toEqual("Please enter a number");
    expect(isIntegerString("true")).toEqual("Please enter a number");
  });

  test("isIntegerString does not return an error when string number given", () => {
    expect(isIntegerString("5")).toBeUndefined();
    expect(isIntegerString("57")).toBeUndefined();
  });

  test("isIntegerString does not return an error when number given", () => {
    expect(isIntegerString(5)).toBeUndefined();
  });

  test("isIntegerString does not return an error when string with spaces given", () => {
    expect(isIntegerString("   ")).toBeUndefined();
  });
  test("isIntegerString does not return an error when blank given", () => {
    expect(isIntegerString("")).toBeUndefined();
    expect(isIntegerString(null)).toBeUndefined();
    expect(isIntegerString(undefined)).toBeUndefined();
  });
});
