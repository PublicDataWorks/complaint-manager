import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";
import { ASCENDING } from "../../../sharedUtilities/constants";
import shiftSingleElementOfArray from "../../../sharedUtilities/shiftSingleElementOfArray";

const getCivilianTitles = asyncMiddleware(async (request, response, next) => {
  const civilianTitles = await getSortedCivilianTitles();
  const civilianTitleValues = civilianTitles.map(civilianTitle => {
    return [civilianTitle.name, civilianTitle.id];
  });
  response.status(200).send(civilianTitleValues);
});

const getSortedCivilianTitles = async () => {
  let civilianTitles = await models.civilian_title.findAll({
    attributes: ["name", "id"],
    order: [["name", ASCENDING]],
    raw: true
  });
  const filteredTarget = civilianTitles.filter(
    civilianTitle => civilianTitle.name === "N/A"
  );
  shiftSingleElementOfArray(civilianTitles, filteredTarget[0], 0);
  return civilianTitles;
};

export default getCivilianTitles;
