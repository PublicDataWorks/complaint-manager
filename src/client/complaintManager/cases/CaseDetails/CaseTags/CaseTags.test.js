import createConfiguredStore from "../../../../createConfiguredStore";
import CaseTags from "./CaseTags";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import {
  getCaseTagSuccess,
  openCaseTagDialog,
  openRemoveCaseTagDialog
} from "../../../actionCreators/casesActionCreators";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

describe("Case Tags", () => {
  let dialog, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(
      getFeaturesSuccess({
        caseTaggingFeature: true
      })
    );

    dialog = mount(
      <Provider store={store}>
        <Router>
          <CaseTags caseId={1} dispatch={jest.fn()} />
        </Router>
      </Provider>
    );

    dispatchSpy.mockClear();
  });

  test("should display button to add tag", () => {
    containsText(dialog, '[data-test="addTagButton"]', "+ Add Tag");
  });

  test("should display placeholder text when no tags exist on case", () => {
    containsText(
      dialog,
      '[data-test="caseTagsContainer"]',
      "No tags have been added"
    );
  });

  test("should display both tags on case", () => {
    const caseTag = [
      {
        id: 1,
        caseId: 1,
        tagId: 1,
        tag: {
          id: 1,
          name: "Penguins"
        }
      },
      {
        id: 2,
        caseId: 1,
        tagId: 2,
        tag: {
          id: 2,
          name: "Osprey"
        }
      }
    ];

    store.dispatch(getCaseTagSuccess(caseTag));

    dialog.update();

    const firstCaseTagChip = dialog.find('[data-test="caseTagChip"]').first();
    const secondCaseTagChip = dialog.find('[data-test="caseTagChip"]').last();

    expect(firstCaseTagChip.text()).toEqual("Penguins");
    expect(secondCaseTagChip.text()).toEqual("Osprey");
  });

  test("add tag button should call openCaseTagDialog when clicked", () => {
    const addTagButton = dialog.find('button[data-test="addTagButton"]');
    addTagButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(openCaseTagDialog());
  });

  test("should open removeCaseTagDialog when remove is clicked", () => {
    const caseTags = [
      {
        id: 1,
        caseId: 1,
        tagId: 1,
        tag: {
          id: 1,
          name: "Penguins"
        }
      },
      {
        id: 2,
        caseId: 1,
        tagId: 2,
        tag: {
          id: 2,
          name: "Osprey"
        }
      }
    ];

    store.dispatch(getCaseTagSuccess(caseTags));

    dialog.update();

    const tagToDelete = dialog.find("ForwardRef(Chip)").first();
    tagToDelete.prop("onDelete")();

    const firstCaseTag = caseTags[0];

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemoveCaseTagDialog(firstCaseTag)
    );
  });
});
