import models from "../policeDataManager/models";
import CaseStatus from "../../sharedTestHelpers/caseStatus";

export const seedStandardCaseStatuses = async () => {
  return await Promise.all([
    models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(1)
        .withName("Initial")
        .withOrderKey(0)
        .build(),
      {
        auditUser: "user"
      }
    ),
    models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(2)
        .withName("Active")
        .withOrderKey(1)
        .build(),
      {
        auditUser: "user"
      }
    ),
    models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(3)
        .withName("Letter in Progress")
        .withOrderKey(2)
        .build(),
      {
        auditUser: "user"
      }
    ),
    models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(4)
        .withName("Ready for Review")
        .withOrderKey(3)
        .build(),
      {
        auditUser: "user"
      }
    ),
    models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(5)
        .withName("Forwarded to Agency")
        .withOrderKey(4)
        .build(),
      {
        auditUser: "user"
      }
    ),
    models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(6)
        .withName("Closed")
        .withOrderKey(5)
        .build(),
      {
        auditUser: "user"
      }
    )
  ]);
};

export const seedLetterSettings = async () => {
  await models.letterSettings.create({
    type: "DEFAULT",
    headerHeight: "1.3in"
  });
};
