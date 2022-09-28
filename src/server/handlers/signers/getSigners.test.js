import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import Signer from "../../../sharedTestHelpers/signer";
import LetterType from "../../../sharedTestHelpers/letterType";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

jest.mock(
  "../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("getSigners", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withId(1)
        .withName("John A Simms")
        .withNickname("jsimms@oipm.gov")
        .withPhone("888-576-9922")
        .withTitle("Independent Police Monitor")
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withId(2)
        .withName("Nina Ambroise")
        .withNickname("nambroise@oipm.gov")
        .withPhone("888-576-9922")
        .withTitle("Complaint Intake Specialist")
        .build(),
      {
        auditUser: "user"
      }
    );
  });

  test("returns signers when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/api/signers")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const status = models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const signer = new Signer.Builder().defaultSigner().withId(1).build();

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withDefaultSender(signer)
        .withRequiredStatus(status)
        .build(),
      { auditUser: "user" }
    );

    await expectResponse(responsePromise, 200, [
      {
        id: 1,
        name: "John A Simms",
        title: "Independent Police Monitor",
        nickname: "jsimms@oipm.gov",
        phone: "888-576-9922",
        links: [
          {
            rel: "signature",
            href: "/api/signers/1/signature"
          }
        ]
      },
      {
        id: 2,
        name: "Nina Ambroise",
        title: "Complaint Intake Specialist",
        nickname: "nambroise@oipm.gov",
        phone: "888-576-9922",
        links: [
          {
            rel: "signature",
            href: "/api/signers/2/signature"
          },
          {
            rel: "delete",
            href: "/api/signers/2",
            method: "delete"
          }
        ]
      }
    ]);
  });
});
