import models from "../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../sharedUtilities/constants";
import legacyAuditDataAccess from "./legacyAuditDataAccess";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { legacyFormatAuditDetails } from "./legacyFormatAuditDetails";

jest.mock("./legacyFormatAuditDetails");

describe("legacyAuditDataAccess", () => {
  describe("audit details", () => {
    let caseForAudit;
    beforeEach(async () => {
      caseForAudit = await createTestCaseWithoutCivilian();
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should call legacyFormatAuditDetails with correct audit details", async () => {
      const auditDetails = { fileName: ["cats.jpg"] };
      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_FILE_TYPE.ATTACHMENT,
          transaction,
          AUDIT_ACTION.DOWNLOADED,
          auditDetails
        );
      });

      expect(legacyFormatAuditDetails).toHaveBeenCalledWith(auditDetails);
    });
  });
});
