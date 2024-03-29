import models from "../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../sharedUtilities/constants";
import legacyAuditDataAccess from "./legacyAuditDataAccess";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { legacyFormatAuditDetails } from "./legacyFormatAuditDetails";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

jest.mock("./legacyFormatAuditDetails");

describe("legacyAuditDataAccess", () => {
  describe("audit details", () => {
    let caseForAudit;

    beforeEach(async () => {
      await cleanupDatabase();
      await models.caseStatus.create(
        new CaseStatus.Builder().defaultCaseStatus().build(),
        { auditUser: "user" }
      );

      caseForAudit = await createTestCaseWithoutCivilian();
    });

    afterEach(async () => {
      await cleanupDatabase();
      legacyFormatAuditDetails.mockClear();
    });

    afterAll(async () => {
      await models.sequelize.close();
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

    test("should not call legacyFormatAuditDetails when they are undefined", async () => {
      await models.sequelize.transaction(async transaction => {
        await legacyAuditDataAccess(
          "user",
          caseForAudit.id,
          AUDIT_FILE_TYPE.ATTACHMENT,
          transaction
        );
      });

      expect(legacyFormatAuditDetails).toHaveBeenCalledTimes(0);
    });
  });
});
