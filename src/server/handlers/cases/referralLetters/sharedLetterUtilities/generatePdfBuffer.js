import pdf from "html-pdf";
import util from "util";
import models from "../../../../policeDataManager/models";

require("../../../../handlebarHelpers");

const generatePdfBuffer = async (letterHtml, type = "DEFAULT") => {
  const settings = await models.letterSettings.findByPk(type);
  const pdfOptions = {
    format: settings.format,
    timeout: 100000,
    width: settings.width,
    height: settings.height,
    border: settings.border,
    header: { height: settings.headerHeight },
    footer: { height: settings.footerHeight }
  };

  let pdfCreator = pdf.create(letterHtml, pdfOptions);
  let pdfToBuffer = util.promisify(pdfCreator.toBuffer.bind(pdfCreator));

  return await pdfToBuffer();
};

export default generatePdfBuffer;
