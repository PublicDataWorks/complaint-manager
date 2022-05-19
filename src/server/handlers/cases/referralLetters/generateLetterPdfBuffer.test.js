import { generateLetterPdfHtml } from "./generateLetterPdfBuffer";
import { retrieveSignatureImageBySigner } from "./retrieveSignatureImage";
import timekeeper from "timekeeper";

const AWS = require("aws-sdk");
jest.mock("aws-sdk");

describe("generateLetterPdfBuffer", () => {
  let timeOfDownload;

  afterEach(async () => {
    timekeeper.reset();
  });

  beforeEach(async () => {
    timeOfDownload = new Date("2018-07-01 12:00:22 CDT");
    timekeeper.freeze(timeOfDownload);

    let s3 = AWS.S3.mockImplementation(() => ({
      config: {
        loadFromPath: jest.fn(),
        update: jest.fn()
      },
      getObject: jest.fn((opts, callback) =>
        callback(undefined, {
          ContentType: "image/bytes",
          Body: {
            toString: () => "bytesbytesbytes"
          }
        })
      )
    }));
  });

  test("generates letter pdf html correctly", async () => {
    const letterBody = "<p> Letter Body </p>";
    const pdfData = {
      recipient: "Recipient Title and Name",
      recipientAddress: "Recipient Address",
      sender: "Sender Address\n Sender Address Second Line",
      transcribedBy: "Transcriber",
      caseReference: "CC-2011-0099"
    };

    const letterPdfHtml = await generateLetterPdfHtml(
      letterBody,
      pdfData,
      false,
      {
        getSignature: async args => {
          return await retrieveSignatureImageBySigner(args.sender);
        },
        templateFile: "referralLetterPdf.tpl"
      }
    );
    expect(letterPdfHtml).toMatchSnapshot();
  });
});
