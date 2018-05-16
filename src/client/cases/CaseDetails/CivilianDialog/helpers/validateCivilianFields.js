import { atLeastOneRequired } from "../../../../formValidations";

const validate = values => {
  const errorMessage = "Please enter phone number or email address";
  const fieldsToValidate = ["phoneNumber", "email"];

  return atLeastOneRequired(values, errorMessage, fieldsToValidate);
};

export default validate;
