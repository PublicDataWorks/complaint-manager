import { atLeastOneRequired } from "../../../../../formValidations";

const validate = values => {
  const errorMessage = "Please enter one form of contact";
  const fieldsToValidate = ["phoneNumber", "email", "address"];

  return atLeastOneRequired(values, errorMessage, fieldsToValidate);
};

export default validate;
