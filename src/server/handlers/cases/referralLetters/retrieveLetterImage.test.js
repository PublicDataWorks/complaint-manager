import { retrieveLetterImage } from "./retrieveLetterImage";

jest.mock("../../../createConfiguredS3Instance");

describe("generateLetterImage", function () {
  const blankLine = "<p><br></p>";

  test("returns an blank line when no image name is provided", async () => {
    expect(await retrieveLetterImage()).toEqual(blankLine);
  });

  test("returns icon image with correct styling when icon image name and style is provided", async () => {
    const icon = await retrieveLetterImage("icon.ico", "max-width: 42px");

    expect(icon).toEqual(
      `<img style="max-width: 42px" src="data:image/bytes;base64,bytesbytesbytes" />`
    );
  });

  test("returns icon image with no styling when just icon image name is provided", async () => {
    const icon = await retrieveLetterImage("icon.ico");

    expect(icon).toEqual(
      `<img style="" src="data:image/bytes;base64,bytesbytesbytes" />`
    );
  });

  test("returns header image with correct styling when header image name and style is provided", async () => {
    const header = await retrieveLetterImage(
      "header_text.png",
      "max-height: 55px"
    );

    expect(header).toEqual(
      `<img style="max-height: 55px" src="data:image/bytes;base64,bytesbytesbytes" />`
    );
  });

  test("returns no image when no image is provided", async () => {
    const image = await retrieveLetterImage();

    expect(image).toEqual(`<p><br></p>`);
  });
});
