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

describe("editLetterType", () => {
  let status, status2, letterType, signer, signer2;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    status = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    status2 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withName("Other Status")
        .withId(12)
        .withOrderKey(23)
        .build(),
      { auditUser: "user" }
    );

    signer = await models.signers.create(
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

    signer2 = await models.signers.create(
      new Signer.Builder()
        .defaultSigner()
        .withId(2)
        .withName("Nina Ambroise")
        .withNickname("nambroise@oipm.gov")
        .withPhone("888-576-9922")
        .withTitle("Intake Specialist")
        .build(),
      {
        auditUser: "user"
      }
    );

    letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withId(1)
        .withType("REFERRAL")
        .withDefaultSender(signer)
        .withRequiredStatus(status)
        .build(),
      {
        auditUser: "user"
      }
    );
  });

  test("edits letter type when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .put(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "SOME_TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status2.name,
        defaultSender: signer2.nickname
      });

    await expectResponse(responsePromise, 200, {
      id: 1,
      type: "SOME_TYPE",
      template: "<div>Hello World</div>",
      editableTemplate: "<section>Goodbye World</section>",
      hasEditPage: true,
      requiresApproval: true,
      requiredStatus: status2.name,
      defaultSender: expect.objectContaining({
        id: signer2.id,
        name: signer2.name,
        nickname: signer2.nickname,
        phone: signer2.phone,
        signatureFile: signer2.signatureFile,
        title: signer2.title
      })
    });
  });

  test("edits letter type when authorized and only some fields changed", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .put(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true
      });

    await expectResponse(responsePromise, 200, {
      id: 1,
      type: "REFERRAL",
      template: "<div>Hello World</div>",
      editableTemplate: "<section>Goodbye World</section>",
      hasEditPage: true,
      requiresApproval: true,
      requiredStatus: status.name,
      defaultSender: expect.objectContaining({
        id: signer.id,
        name: signer.name,
        nickname: signer.nickname,
        phone: signer.phone,
        signatureFile: signer.signatureFile,
        title: signer.title
      })
    });
  });

  test("should return 404 if letter type doesn't exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .put("/api/letter-types/1235")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true
      });

    await expectResponse(responsePromise, 404);
  });

  test("should return 400 when defaultSender does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .put(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "SOME_TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status2.name,
        defaultSender: "notavalidsigner@invalid.net"
      });

    await expectResponse(responsePromise, 400);
  });

  test("should return 400 when requiredStatus does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .put(`/api/letter-types/${letterType.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "SOME_TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: "Not a real status",
        defaultSender: signer2.nickname
      });

    await expectResponse(responsePromise, 400);
  });
});
