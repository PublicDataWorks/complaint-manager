import React from "react";
import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import DropzoneContainer from "./DropzoneContainer";
import Dropzone from "./Dropzone";
import { mockLocalStorage } from "../../../../../mockLocalStorage";
import {
  getCaseDetailsSuccess,
  uploadAttachmentSuccess
} from "../../../actionCreators/casesActionCreators";
import {
  dropDuplicateFile,
  removeDropzoneFile
} from "../../../actionCreators/attachmentsActionCreators";
import Case from "../../../testUtilities/case";

describe("connected Dropzone", () => {
  let dropzone;

  beforeEach(() => {
    mockLocalStorage();
    const store = createConfiguredStore();

    const defaultCase = new Case.Builder().defaultCase().build();

    store.dispatch(getCaseDetailsSuccess(defaultCase));

    const dropzoneWrapper = mount(
      <Provider store={store}>
        <DropzoneContainer />
      </Provider>
    );

    dropzone = dropzoneWrapper.find(Dropzone);
  });

  test("should map errorMessage from state", () => {
    expect(dropzone.prop("errorMessage")).toBeDefined();
  });

  test("should map caseId from state", () => {
    expect(dropzone.prop("caseId")).toBeDefined();
  });

  test("should map the actions to props", () => {
    expect(dropzone.prop("uploadAttachmentSuccess")).toBeDefined();
    expect(dropzone.prop("snackbarSuccess")).toBeDefined();
    expect(dropzone.prop("dropDuplicateFile")).toBeDefined();
    expect(dropzone.prop("removeDropzoneFile")).toBeDefined();
  });
});
