import pdf from "html-pdf";
import util from "util";

require("../../../../handlebarHelpers");

const generatePdfBuffer = async letterHtml => {
  const pdfOptions = {
    format: "Letter",
    timeout: 100000,
    width: "8.5in",
    height: "11in",
    border: "0.5in",
    header: { height: "1.3 in" },
    footer: { height: "0.7 in" },
    base: "file:///app/src/server/handlers/cases/referralLetters/assets/"
  };

  let pdfCreator = pdf.create(letterHtml, pdfOptions);
  let pdfToBuffer = util.promisify(pdfCreator.toBuffer.bind(pdfCreator));

  return await pdfToBuffer();
};

export default generatePdfBuffer;
