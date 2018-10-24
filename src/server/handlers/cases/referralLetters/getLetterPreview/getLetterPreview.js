import asyncMiddleware from "../../../asyncMiddleware";
import fs from "fs";
import Handlebars from "handlebars";
import models from "../../../../models";

const getLetterPreview = asyncMiddleware(async (request, response, next) => {
  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getLetterPreview/letter.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());

  const caseData = await models.cases.findById(request.params.id, {
    raw: true,
    attributes: [["id", "caseId"], "incidentDate"]
  });
  const html = compiledTemplate(caseData);
  response.send(html);
});

export default getLetterPreview;
