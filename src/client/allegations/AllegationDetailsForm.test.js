import React from "react";

import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import createConfiguredStore from "../createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import AllegationDetailsForm from "./AllegationDetailsForm";
import { changeInput } from "../../testHelpers";

jest.mock(
  "../cases/thunks/createOfficerAllegation",
  () => (formValues, caseId, caseOfficerId) => ({
    type: "something",
    formValues,
    caseId,
    caseOfficerId
  })
);

describe("AllegationDetailsForm", () => {
  test("it calls createOfficerAllegation with appropriate values on submit", () => {
    const store = createConfiguredStore();
    const dispatch = jest.spyOn(store, "dispatch");
    const allegationId = 1;
    const caseId = 15;
    const caseOfficerId = 4;

    const allegationDetailsForm = mount(
      <Provider store={store}>
        <AllegationDetailsForm
          allegationId={allegationId}
          form={`AllegationForm_${allegationId}`}
          caseId={caseId}
          caseOfficerId={caseOfficerId}
        />
      </Provider>
    );

    changeInput(
      allegationDetailsForm,
      '[data-test="allegationDetailsInput"]',
      "some details"
    );

    const addButton = allegationDetailsForm
      .find('[data-test="addAllegationButton"]')
      .last();
    addButton.simulate("click");

    const formValues = { allegationId, details: "some details" };

    expect(dispatch).toHaveBeenCalledWith(
      createOfficerAllegation(formValues, caseId, caseOfficerId)
    );
  });
});
