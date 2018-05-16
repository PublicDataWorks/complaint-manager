import {
  addressMustBeAutoSuggested,
  atLeastOneRequired
} from "./formValidations";

describe("synchronous validations", () => {
  test("test phone number or email validation when flat object", () => {
    const testValues = {
      phoneNumber: "",
      email: ""
    };

    const expectedErrors = {
      phoneNumber: "Please enter phone number or email address",
      email: "Please enter phone number or email address"
    };

    const errors = atLeastOneRequired(
      testValues,
      "Please enter phone number or email address",
      ["phoneNumber", "email"]
    );

    expect(errors).toEqual(expectedErrors);
  });

  test("test empty phone number or email validation when nested object", () => {
    const testValues = {
      civilian: {
        phoneNumber: "",
        email: ""
      }
    };

    const expectedErrors = {
      civilian: {
        phoneNumber: "Please enter phone number or email address",
        email: "Please enter phone number or email address"
      }
    };

    const errors = atLeastOneRequired(
      testValues,
      "Please enter phone number or email address",
      ["civilian.phoneNumber", "civilian.email"]
    );

    expect(errors).toEqual(expectedErrors);
  });

  test("test valid phone number or email validation when nested object", () => {
    const testValues = {
      civilian: {
        phoneNumber: " 9999999999 ",
        email: " sdflkj@slfkj.com"
      }
    };

    const expectedErrors = {};
    const errors = atLeastOneRequired(
      testValues,
      "Please enter phone number or email address",
      ["civilian.phoneNumber", "civilian.email"]
    );
    expect(errors).toEqual(expectedErrors);
  });

  test("should not produce errors when one of the fields is provided", () => {
    const testValues = {
      phoneNumber: "",
      email: "example@test.com"
    };
    const expectedErrors = {};

    const errors = atLeastOneRequired(
      testValues,
      "Please enter phone number or email address",
      ["phoneNumber", "email"]
    );

    expect(errors).toEqual(expectedErrors);
  });

  test("should add error when field is just spaces", () => {
    const testValues = {
      phoneNumber: "  ",
      email: "   "
    };
    const errors = atLeastOneRequired(testValues, "Please enter at least one", [
      "phoneNumber",
      "email"
    ]);
    expect(errors).toEqual({
      phoneNumber: "Please enter at least one",
      email: "Please enter at least one"
    });
  });

  test("should produce errors when address is not autosuggested", () => {
    const address = {
      city: "Chicago",
      state: "IL",
      country: "US"
    };

    const someAddressInAutoCompleteTextField = "asdfsdf";

    const errors = addressMustBeAutoSuggested(
      address,
      someAddressInAutoCompleteTextField
    );

    const expectedErrors = {
      autoSuggestValue: "Please select an address from the suggestion list"
    };

    expect(errors).toEqual(expectedErrors);
  });

  test("should not produce error when address is from autosuggest", () => {
    const address = {
      city: "Chicago",
      state: "IL",
      country: "US"
    };

    const someAddressInAutoCompleteTextField = "Chicago, IL, US";

    const errors = addressMustBeAutoSuggested(
      address,
      someAddressInAutoCompleteTextField
    );

    const expectedErrors = {};

    expect(errors).toEqual(expectedErrors);
  });
});
