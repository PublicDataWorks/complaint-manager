import { atLeastOneRequired } from "../../../../formValidations";

const validate = (values, createCaseAddressInputFeature) => {
  let errorMessage;
  if (createCaseAddressInputFeature) {
    errorMessage = "Please enter one form of contact";
  } else {
    errorMessage = "Please enter phone number or email address";
  }
  const fieldsToValidate = createCaseAddressInputFeature
    ? ["phoneNumber", "email", "address"]
    : ["phoneNumber", "email"];

  return atLeastOneRequired(values, errorMessage, fieldsToValidate);
};

export default validate;
