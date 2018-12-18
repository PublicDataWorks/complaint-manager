import downloadFailed from "../../actionCreators/downloadActionCreators";
import inBrowserDownload from "./inBrowserDownload";
import nock from "nock";
import configureInterceptors from "../../interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("in browser download thunk", function() {
  let testPath,
    dispatch,
    htmlAnchorId,
    getElementSpy,
    linkClickSpy,
    htmlAnchor,
    responseData,
    mockCallback;

  beforeEach(() => {
    testPath = "/some-path";
    dispatch = jest.fn();
    configureInterceptors({dispatch})
    htmlAnchorId = "id";
    getElementSpy = jest.spyOn(document, "getElementById");
    linkClickSpy = jest.fn();
    htmlAnchor = {
      href: "",
      click: linkClickSpy
    };
    responseData = "https://url of the file to download";
    mockCallback = jest.fn();
  });

  test("should add an anchor html tag with the file to download", async () => {
    getElementSpy.mockImplementationOnce(id => htmlAnchor);

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(testPath)
      .reply(200, responseData);

    await inBrowserDownload(testPath, htmlAnchorId)(dispatch);

    expect(getElementSpy).toHaveBeenCalledWith(htmlAnchorId);
    expect(htmlAnchor.href).toBe(responseData);
    expect(linkClickSpy).toHaveBeenCalled();
  });

  test("calls callback on success if given", async () => {
    getElementSpy.mockImplementationOnce(id => htmlAnchor);

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(testPath)
      .reply(200, responseData);

    await inBrowserDownload(testPath, htmlAnchorId, mockCallback)(dispatch);
    expect(mockCallback).toHaveBeenCalled();
  });

  test("should display error snackbar when download fails", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(testPath)
      .reply(500);
    await inBrowserDownload(testPath, htmlAnchorId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(downloadFailed());
  });

  test("should execute callback if given when download fails", async () => {
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(testPath)
      .reply(500);
    await inBrowserDownload(testPath, htmlAnchorId, mockCallback)(dispatch);
    expect(mockCallback).toHaveBeenCalled();
  });
});
