import { atLeastOneRequired } from "../../../../formValidations";
import {
  fieldTooShort,
  includesInvalidCharacter
} from "../../../../searchFormValidations";

const validate = values => {
  const includesInvalidCharMessage = "Please note that % and _ are not allowed";
  const fieldTooShortMessage = "Please enter at least two characters";

  const errors = atLeastOneRequired(
    values,
    "Please complete at least one field",
    ["firstName", "lastName", "districtId"]
  );

  if (includesInvalidCharacter(values.firstName)) {
    errors.firstName = includesInvalidCharMessage;
  } else if (fieldTooShort(values.firstName)) {
    errors.firstName = fieldTooShortMessage;
  }

  if (includesInvalidCharacter(values.lastName)) {
    errors.lastName = includesInvalidCharMessage;
  } else if (fieldTooShort(values.lastName)) {
    errors.lastName = fieldTooShortMessage;
  }

  return errors;
};

export default validate;
