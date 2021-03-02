import createConfiguredStore from "../../../../createConfiguredStore";
import CaseTags from "./CaseTags";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import { containsText } from "../../../../testHelpers";
import {
  fetchingCaseTags,
  getCaseTagSuccess,
  openCaseTagDialog,
  openRemoveCaseTagDialog
} from "../../../actionCreators/casesActionCreators";

describe("Case Tags", () => {
  let dialog, dispatchSpy, store;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    dialog = mount(
      <Provider store={store}>
        <Router>
          <CaseTags caseId={1} dispatch={jest.fn()} />
        </Router>
      </Provider>
    );

    dispatchSpy.mockClear();
  });

  test("should display button to add tag when case is not archived", () => {
    containsText(dialog, '[data-testid="addTagButton"]', "+ Add Tag");
  });

  test("should display placeholder text when no tags exist on case", () => {
    containsText(dialog, '[data-testid="caseTagsContainer"]', "");

    store.dispatch(fetchingCaseTags(false));

    containsText(
      dialog,
      '[data-testid="caseTagsContainer"]',
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

    containsText(dialog, '[data-testid="caseTagsContainer"]', "");

    store.dispatch(fetchingCaseTags(false));

    dialog.update();

    const firstCaseTagChip = dialog.find('[data-testid="caseTagChip"]').first();
    const secondCaseTagChip = dialog.find('[data-testid="caseTagChip"]').last();

    expect(firstCaseTagChip.text()).toEqual("Penguins");
    expect(secondCaseTagChip.text()).toEqual("Osprey");
  });

  test("add tag button should call openCaseTagDialog when clicked when case is not archived", () => {
    const addTagButton = dialog.find('button[data-testid="addTagButton"]');
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
    store.dispatch(fetchingCaseTags(false));

    dialog.update();

    const tagToDelete = dialog.find("ForwardRef(Chip)").first();
    tagToDelete.prop("onDelete")();

    const firstCaseTag = caseTags[0];

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemoveCaseTagDialog(firstCaseTag)
    );
  });

  test("should not display button to add tag when case is archived", () => {
    dialog = mount(
        <Provider store={store}>
          <Router>
            <CaseTags caseId={1} isArchived={true} dispatch={jest.fn()} />
          </Router>
        </Provider>
    );

    const noDisplayButton = dialog.find('[data-testid="addTagButton"]').first();
    expect(noDisplayButton).toEqual({});
  });
});
