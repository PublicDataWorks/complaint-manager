import _ from "lodash";
import formatAddress from "./utilities/formatAddress";

export function atLeastOneRequired(values, errorMessage, keys) {
  const allAbsent = keys.every(key => {
    const value = _.get(values, key);
    return !value || value.trim() === "";
  });

  const errors = {};
  if (allAbsent) {
    keys.forEach(key => _.set(errors, key, errorMessage));
  }

  return errors;
}

export function addressMustBeAutoSuggested(address, autoCompleteText) {
  const formattedAddress = formatAddress(address);

  const errors = {};

  if (autoCompleteText && formattedAddress !== autoCompleteText) {
    errors.autoSuggestValue =
      "Please select an address from the suggestion list";
  }

  return errors;
}
