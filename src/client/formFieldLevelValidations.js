import validator from "validator";

const isRequired = text => value => {
  return value ? undefined : `Please enter ${text}`;
};

const selectRequired = text => value => {
  return value ? undefined : `Please select ${text}`;
};

export const isIntegerString = value => {
  const trimmedValue = typeof value === "string" ? value.trim() : value;
  const isInt = !trimmedValue || /^\d+$/.test(trimmedValue);
  return isInt ? undefined : "Please enter a number";
};

const notBlank = text => value =>
  value.trim() === "" ? `Please enter ${text}` : undefined;

export const isPhoneNumber = value => {
  if (!value) {
    return undefined;
  }
  const formattedVal = value.replace(/[() -]/g, "");
  const missingOrValid =
    !Boolean(formattedVal) || /^[0-9]{10}$/.test(formattedVal);
  return missingOrValid ? undefined : "Please enter a numeric 10 digit value";
};

export const isEmail = value => {
  const missingOrValid = !Boolean(value) || validator.isEmail(value);
  return missingOrValid ? undefined : "Please enter a valid email address";
};

export const notFutureDate = value => {
  const today = new Date(Date.now());
  const chosenDate = new Date(value);

  return chosenDate.getTime() > today.getTime()
    ? `Date cannot be in the future`
    : undefined;
};

export const reviewersShouldBeDifferent = (value, values) => {
  if (values.firstReviewer === values.secondReviewer) {
    return "You’ve selected the same user for both Reviewers. Please change one.";
  } else {
    return undefined;
  }
};

export const characterLimit = limit => value => {
  return value.length <= limit
    ? undefined
    : `This field has a character limit of ${limit}`;
};

export const firstNameRequired = isRequired("First Name");
export const lastNameRequired = isRequired("Last Name");
export const firstNameNotBlank = notBlank("First Name");
export const lastNameNotBlank = notBlank("Last Name");
export const emailIsRequired = isRequired("Email Address");
export const genderIdentityIsRequired = isRequired("Gender Identity");
export const raceEthnicityIsRequired = isRequired("Race/Ethnicity");
export const actionIsRequired = selectRequired("action");
export const allegationDetailsRequired = isRequired("Allegation Details");
export const allegationDetailsNotBlank = notBlank("Allegation Details");
export const allegationSeverityRequired = selectRequired("Allegation Severity");
export const letterTypeRequired = isRequired("Letter Type");
export const letterTypeNotBlank = notBlank("Letter Type");
export const officerRoleRequired = selectRequired("Role on Case");
export const titleIsRequired = isRequired("Title");
export const intakeSourceIsRequired = isRequired("Intake Source");
export const complaintTypeIsRequired = isRequired("Complaint Type");
export const caseTagRequired = isRequired("a tag name");
export const firstReviewerRequired = selectRequired("a First Reviewer");
export const secondReviewerRequired = selectRequired("a Second Reviewer");
export const nameRequired = isRequired("Name");
export const nameNotBlank = notBlank("Name");
export const roleRequired = isRequired("Role");
export const roleNotBlank = notBlank("Role");
export const phoneRequired = isRequired("Phone Number");
export const phoneNotBlank = notBlank("Phone Number");
export const usernameRequired = isRequired("Username");
export const usernameNotBlank = notBlank("Username");
export const defaultSenderRequired = selectRequired("Default Sender");
export const defaultSenderNotBlank = notBlank("Default Sender");
export const statusRequired = selectRequired("Status");
export const statusNotBlank = notBlank("Status");
export const characterLimit100 = characterLimit(100);
