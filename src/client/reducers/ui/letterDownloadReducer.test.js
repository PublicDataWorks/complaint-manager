import letterDownloadReducer from "./letterDownloadReducer";
import {
  startLetterDownload,
  stopLetterDownload
} from "../../actionCreators/letterActionCreators";

describe("letterDownloadReducer", () => {
  test("default returns initial state", () => {
    const newState = letterDownloadReducer(undefined, { TYPE: "SOMETHING" });
    expect(newState).toEqual({ downloadInProgress: false });
  });

  test("sets downloadInProgress to true when start download", () => {
    const newState = letterDownloadReducer(
      { downloadInProgress: false },
      startLetterDownload()
    );
    expect(newState).toEqual({ downloadInProgress: true });
  });

  test("sets downloadInProgress to false when stop download", () => {
    const newState = letterDownloadReducer(
      { downloadInProgress: true },
      stopLetterDownload()
    );
    expect(newState).toEqual({ downloadInProgress: false });
  });
});
