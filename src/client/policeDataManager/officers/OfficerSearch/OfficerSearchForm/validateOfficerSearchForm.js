import { atLeastOneRequired } from "../../../../formValidations";
import {
  fieldTooShort,
  includesInvalidCharacter
} from "../../../../searchFormValidations";

const validate = fields => values => {
  const includesInvalidCharMessage = "Please note that % and _ are not allowed";
  const fieldTooShortMessage = "Please enter at least two characters";

  const errors = atLeastOneRequired(
    values,
    "Please complete at least one field",
    fields.map(field => field.name)
  );

  fields.forEach(field => {
    if (field.isText) {
      if (includesInvalidCharacter(values[field.name])) {
        errors[field.name] = includesInvalidCharMessage;
      } else if (fieldTooShort(values[field.name])) {
        errors[field.name] = fieldTooShortMessage;
      }
    }
  });

  return errors;
};

export default validate;
