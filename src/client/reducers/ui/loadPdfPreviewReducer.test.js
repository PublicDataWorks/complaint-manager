import loadPdfPreviewReducer from "./loadPdfPreviewReducer";
import {
  finishLoadingPdfPreview,
  startLoadingPdfPreview
} from "../../actionCreators/letterActionCreators";

describe("loadPdfPreviewReducer", () => {
  test("default returns initial state", () => {
    const newState = loadPdfPreviewReducer(undefined, { TYPE: "SOMETHING" });
    expect(newState).toEqual({ loadingPdfPreview: false });
  });

  test("sets loadingPdfPreview to true when starting loading", () => {
    const newState = loadPdfPreviewReducer(
      { loadingPdfPreview: false },
      startLoadingPdfPreview()
    );
    expect(newState).toEqual({ loadingPdfPreview: true });
  });

  test("sets loadingPdfPreview to false when finished loading", () => {
    const newState = loadPdfPreviewReducer(
      { loadingPdfPreview: true },
      finishLoadingPdfPreview()
    );
    expect(newState).toEqual({ loadingPdfPreview: false });
  });
});
