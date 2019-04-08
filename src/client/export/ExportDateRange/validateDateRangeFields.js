import moment from "moment-timezone";
import _ from "lodash";
import { SubmissionError } from "redux-form";

const validateDateRangeOrder = (values, fromValueName, toValueName) => {
  if (
    values[fromValueName] &&
    values[toValueName] &&
    moment(values[fromValueName]).isAfter(moment(values[toValueName]))
  ) {
    return { [fromValueName]: "From date cannot be after To date" };
  }
};

export const validateDateRangeFields = (values, formLabel) => {
  let errors = {};

  const fromValueName = `${formLabel}From`;
  const toValueName = `${formLabel}To`;

  errors = {
    ...errors,
    ...validateDateRangeOrder(values, fromValueName, toValueName)
  };
  if (!values[fromValueName]) {
    errors[fromValueName] = "Please enter a date";
  }
  if (!values[toValueName]) {
    errors[toValueName] = "Please enter a date";
  }
  if (!_.isEmpty(errors)) {
    throw new SubmissionError(errors);
  }
};
