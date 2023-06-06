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
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

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

describe("addLetterType", () => {
  let status, signer;

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

    await models.complaintTypes.create({ name: CIVILIAN_INITIATED });
    await models.complaintTypes.create({ name: RANK_INITIATED });

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
  });

  test("adds letter type when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .post("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "NEW LETTER TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status.name,
        defaultSender: signer.nickname
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        type: "NEW LETTER TYPE",
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
      })
    );
  });

  test("should also add complaint types to letter_types_complaint_types if included", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .post("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "NEW LETTER TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status.name,
        defaultSender: signer.nickname,
        complaintTypes: [RANK_INITIATED, CIVILIAN_INITIATED]
      });

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        type: "NEW LETTER TYPE",
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
        }),
        complaintTypes: expect.arrayContaining([
          RANK_INITIATED,
          CIVILIAN_INITIATED
        ])
      })
    );
  });

  test("should return 400 when letter type already exists", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("NEW LETTER TYPE")
        .withDefaultSender(signer)
        .withRequiredStatus(status)
        .build(),
      {
        auditUser: "user"
      }
    );

    const responsePromise = request(app)
      .post("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "NEW LETTER TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status.name,
        defaultSender: signer.nickname
      });

    await expectResponse(responsePromise, 400);
  });

  test("should return 400 if the signer does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .post("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "NEW LETTER TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: status.name,
        defaultSender: "not a real sender",
        complaintTypes: [RANK_INITIATED, CIVILIAN_INITIATED]
      });

    await expectResponse(
      responsePromise,
      400,
      expect.objectContaining({ message: BAD_REQUEST_ERRORS.INVALID_SENDER })
    );
  });

  test("should return 400 if the requiredStatus does not exist", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.ADMIN_ACCESS,
      "nickname"
    );

    const responsePromise = request(app)
      .post("/api/letter-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "NEW LETTER TYPE",
        template: "<div>Hello World</div>",
        editableTemplate: "<section>Goodbye World</section>",
        hasEditPage: true,
        requiresApproval: true,
        requiredStatus: "FAKE STATUS!",
        defaultSender: signer.nickname,
        complaintTypes: [RANK_INITIATED, CIVILIAN_INITIATED]
      });

    await expectResponse(
      responsePromise,
      400,
      expect.objectContaining({
        message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
      })
    );
  });
});
