import app from "../../server/server";
import { Verifier } from "@pact-foundation/pact";
import path from "path";
import { cleanupDatabase } from "../../server/testHelpers/requestTestHelpers";
import models from "../../server/policeDataManager/models";
import Case from "../../sharedTestHelpers/case";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import { CASE_STATUS, COMPLAINANT } from "../../sharedUtilities/constants";
import IntakeSource from "../../server/testHelpers/intakeSource";
import ReferralLetter from "../../server/testHelpers/ReferralLetter";
import { updateCaseStatus } from "../../server/handlers/data/queries/queryHelperFunctions";
import { random } from "lodash";

jest.mock(
  "../../server/handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3",
  () => jest.fn()
);

const setupCase = async () => {
  try {
    models.cases.destroy({ where: {}, truncate: true, auditUser: "user" });

    const intakeSource = await models.intake_source.create(
      new IntakeSource.Builder().defaultIntakeSource().withId(random(5, 99999)),
      { auditUser: "user" }
    );

    const c = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withComplaintType("Civilian Within NOPD Initiated")
        .withIntakeSourceId(intakeSource.id),
      {
        auditUser: "user"
      }
    );

    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer(),
      { auditUser: "user" }
    );

    const case_officer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(officer.id)
        .withCaseId(c.id)
        .withRoleOnCase(COMPLAINANT),
      { auditUser: "user" }
    );

    return c;
  } catch (e) {
    console.log(e);
  }
};

const setupLetter = async letterCase => {
  try {
    await updateCaseStatus(letterCase, CASE_STATUS.READY_FOR_REVIEW);

    const letter = await models.referral_letter.create(
      new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withCaseId(letterCase.id)
        .withRecipient("King of all police")
        .withRecipientAddress("100 Main Street, North Pole")
        .withSender("The aggrieved party"),
      { auditUser: "user" }
    );
  } catch (e) {
    console.log(e);
  }
};

describe("Pact Verification", () => {
  let server;
  beforeAll(() => {
    server = app.listen(8989);
  });

  afterAll(async () => {
    await cleanupDatabase();
    await models.sequelize.close();
    await server.close();
  });

  test("validates the expectations of get case details", async () => {
    const opts = {
      logLevel: "INFO",
      providerBaseUrl: "http://localhost:8989",
      provider: "police-data-manager.server",
      providerVersion: "1.0.0",
      pactUrls: [
        path.resolve(
          __dirname,
          "../../../pact/pacts/police-data-manager.client-police-data-manager.server.json"
        )
      ],
      stateHandlers: {
        "Case exists": async () => {
          await cleanupDatabase();
          await setupCase();
        },
        "letter is ready for review": async () => {
          await cleanupDatabase();
          const letterCase = await setupCase();
          await setupLetter(letterCase);
        }
      }
    };

    const output = await new Verifier(opts).verifyProvider();
    console.log(output);
  });
});
