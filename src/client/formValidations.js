import _ from "lodash";

export function atLeastOneRequired(values, errorMessage, keys) {
  const allAbsent = keys.every(key => {
    const value = _.get(values, key);
    if (key === "address") {
      return !value || value.placeId === null;
    } else {
      return !value || (typeof value !== "number" && value.trim() === "");
    }
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

export function addressMustBeValid(addressValid, errors = {}) {
  if (!addressValid) {
    errors.autoSuggestValue = "Please enter a valid address";
  }
  return errors;
}
