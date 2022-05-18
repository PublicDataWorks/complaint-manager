import { generateLetterPdfHtml } from "./generateLetterPdfBuffer";
import { retrieveSignatureImageBySigner } from "./retrieveSignatureImage";

describe("generateLetterPdfBuffer", () => {
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
