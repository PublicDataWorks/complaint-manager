import { atLeastOneRequired } from "../../formValidations";
import {
  fieldTooShort,
  includesInvalidCharacter
} from "../../searchFormValidations";

const validateAllegationSearchForm = values => {
  const emptyFieldsMessage = "Please complete at least one field";
  const errors = atLeastOneRequired(values, emptyFieldsMessage, [
    "rule",
    "paragraph",
    "directive"
  ]);

  if (includesInvalidCharacter(values.directive)) {
    errors.directive = "Please note that % and _ are not allowed";
  } else if (fieldTooShort(values.directive)) {
    errors.directive = "Please enter at least two characters";
  }

  return errors;
};

export default validateAllegationSearchForm;
