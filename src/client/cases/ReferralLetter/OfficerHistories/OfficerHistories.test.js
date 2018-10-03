import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import OfficerHistories from "./OfficerHistories";
import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { changeInput, containsText } from "../../../testHelpers";
import OfficerHistoryNote from "./OfficerHistoryNote";
jest.mock("../../../shared/components/RichTextEditor/RichTextEditor");

describe("OfficerHistories page", function() {
  let wrapper, store, caseId;
  beforeEach(() => {
    caseId = "4";
    const caseDetail = {
      id: caseId,
      accusedOfficers: [
        { fullName: "Officer 1", id: 0 },
        { fullName: "Officer 2", id: 1 },
        { fullName: "Officer 3", id: 2 }
      ]
    };

    store = createConfiguredStore();
    store.dispatch(getCaseDetailsSuccess(caseDetail));

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerHistories match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("it renders a tab header for each officer", () => {
    containsText(wrapper, "[data-test='tab-0']", "Officer 1");
    containsText(wrapper, "[data-test='tab-1']", "Officer 2");
    containsText(wrapper, "[data-test='tab-2']", "Officer 3");
  });

  test("it renders a tab content for the default selected officer", () => {
    containsText(wrapper, "[data-test='tab-content-0']", "Officer 1");
    expect(
      wrapper.find("[data-test='tab-content-0']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-1']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-2']").get(0).props.style
    ).toHaveProperty("display", "none");
  });

  test("it renders a tab content for the selected officer", () => {
    wrapper
      .find("[data-test='tab-1']")
      .first()
      .simulate("click");
    containsText(wrapper, "[data-test='tab-content-1']", "Officer 2");
    expect(
      wrapper.find("[data-test='tab-content-1']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-0']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-2']").get(0).props.style
    ).toHaveProperty("display", "none");
  });

  test("it calculates the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='officers[0].numHistoricalHighAllegations']",
      "1"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numHistoricalMedAllegations']",
      "2"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numHistoricalLowAllegations']",
      "3"
    );
    containsText(
      wrapper,
      `[data-test='officers-0-total-historical-allegations']`,
      "6 total allegations"
    );
  });

  test("it ignores invalid values when calculating the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='officers[0].numHistoricalHighAllegations']",
      "abc"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numHistoricalMedAllegations']",
      " "
    );
    changeInput(wrapper, "[name='officers[0].numHistoricalLowAllegations']", 2);
    containsText(
      wrapper,
      `[data-test='officers-0-total-historical-allegations']`,
      "2 total allegations"
    );
  });

  test("it should display message when no officers", () => {
    const caseDetailWithoutOfficers = {
      id: caseId,
      accusedOfficers: []
    };
    store.dispatch(getCaseDetailsSuccess(caseDetailWithoutOfficers));
    wrapper.update();
    containsText(
      wrapper,
      `[data-test='no-officers-message']`,
      "There are no officers on this case"
    );
  });

  test("it should add a note when click add note button", () => {
    const addNoteButton = wrapper
      .find('[data-test="addOfficerHistoryNoteButton"]')
      .first();
    addNoteButton.simulate("click");
    expect(wrapper.find(OfficerHistoryNote).length).toEqual(1);
  });

  test("it should remove a note when click add note button", () => {
    const addNoteButton = wrapper
      .find('[data-test="addOfficerHistoryNoteButton"]')
      .first();
    addNoteButton.simulate("click");
    addNoteButton.simulate("click");
    addNoteButton.simulate("click");

    const notesFields = wrapper.find(OfficerHistoryNote);
    expect(notesFields.length).toEqual(3);
    changeInput(
      notesFields.first(),
      '[data-test="note-pib-case-number"]',
      "first note"
    );
    changeInput(
      notesFields.at(1),
      '[data-test="note-pib-case-number"]',
      "second note"
    );
    changeInput(
      notesFields.at(2),
      '[data-test="note-pib-case-number"]',
      "third note"
    );

    const indexOfSecondNote = 1;
    const openDialogButton = wrapper
      .find(
        `[data-test="note-${indexOfSecondNote}-openRemoveOfficerHistoryNoteButton"]`
      )
      .first();
    openDialogButton.simulate("click");
    const removeNoteButton = wrapper
      .find('[data-test="removeOfficerHistoryNoteButton"]')
      .first();
    removeNoteButton.simulate("click");

    const updatedNotesFields = wrapper.find(OfficerHistoryNote);
    expect(updatedNotesFields.length).toEqual(2);
    const firstNotePIBField = updatedNotesFields
      .first()
      .find('[data-test="note-pib-case-number"]');
    const secondNotePIBField = updatedNotesFields
      .at(1)
      .find('[data-test="note-pib-case-number"]');
    expect(firstNotePIBField.props().value).toEqual("first note");
    expect(secondNotePIBField.props().value).toEqual("third note");
  });
});
