import downloadFailed from "../../actionCreators/downloadActionCreators";
import inBrowserDownload from "./inBrowserDownload";
import nock from "nock";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("in browser download thunk", function() {
  const testPath = "/some-path";
  const dispatch = jest.fn();

  test("should add an anchor html tag with the file to download", async () => {
    const htmlAnchorId = "id";
    const getElementSpy = jest.spyOn(document, "getElementById");
    const linkClickSpy = jest.fn();
    const htmlAnchor = {
      href: "",
      click: linkClickSpy
    };
    getElementSpy.mockImplementationOnce(id => htmlAnchor);

    const responseData = "https://url of the file to download";
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

  test("should display error snackbar when download fails", async () => {
    const htmlAnchorId = "id";
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
});
