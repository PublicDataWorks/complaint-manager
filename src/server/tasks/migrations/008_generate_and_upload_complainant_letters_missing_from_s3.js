import {
  complainantLetterExistsInAws,
  uploadComplainantLetterToS3ForMigration
} from "../taskMigrationJobs/generateComplainantLetters/generateComplainantLettersHelpers";
import models from "../../models";

module.exports = {
  up: async () => {
    const complainantLetters = await models.complainant_letter.findAll({
      include: [
        { model: models.civilian, as: "complainantCivilian" },
        { model: models.case_officer, as: "caseOfficers" }
      ]
    });

    for (let i = 0; i < complainantLetters.length; i++) {
      const letterAlreadyExists = await complainantLetterExistsInAws(
        complainantLetters[i]
      );
      if (!letterAlreadyExists) {
        await uploadComplainantLetterToS3ForMigration(complainantLetters[i]);
      }
    }
  },
  down: async () => {
    // We will not be doing a down here as we believe that it would be unwise to delete objects from S3.
  }
};
