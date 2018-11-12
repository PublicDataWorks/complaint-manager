import pdf from "html-pdf";
import asyncMiddleware from "../../../asyncMiddleware";

const generatePdf = asyncMiddleware(async (request, response) => {
  const fileContents = "<p> html letter contents </p>";
  const pdfOptions = {
    format: "Letter",
    // phantomPath: "/usr/bin/phantomjs",
    timeout: 100000,
    width: "8.5in",
    height: "11in",
    border: "0.5in",
    header: { height: "1.3 in" },
    footer: { height: "0.7 in" }
  };

  pdf.create(fileContents, pdfOptions).toBuffer((error, buffer) => {
    console.log(buffer);
    response.send(buffer);
  });
});

export default generatePdf;
