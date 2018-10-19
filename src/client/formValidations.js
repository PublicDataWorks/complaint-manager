import _ from "lodash";

export function atLeastOneRequired(values, errorMessage, keys) {
  const allAbsent = keys.every(key => {
    const value = _.get(values, key);
    return !value || value.trim() === "";
  });

  const errors = {};
  if (allAbsent) {
    keys.forEach(key => {
      if (!key.includes("email")) {
        _.set(errors, key, errorMessage);
      }
    });
  }
  return errors;
}

export function addressMustBeValid(addressValid) {
  const errors = {};
  if (!addressValid) {
    errors.autoSuggestValue = "Please enter a valid address";
  }
  return errors;
}

export function timeMustBeValid(time) {
  if (time === null) {
    return "Please enter a time in the form of 12:34 AM";
  }
}
