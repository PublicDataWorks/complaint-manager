import {
  transformNewAuthenticationAuditsToOld,
  transformOldAuthenticationAuditsToNew
} from "./transformAuthenticationAudits";
import {
  transformNewDataAccessAuditsToOld,
  transformOldDataAccessAuditsToNew
} from "./transformDataAccessAudits";
import {
  transformNewExportAuditsToOld,
  transformOldExportAuditsToNew
} from "./transformExportAudits";
import {
  copyAttachmentDataChangeAuditsToActionAudits,
  deleteUploadAttachmentAudits
} from "./copyAttachmentDataChangeAuditsToActionAudits";
import {
  transformNewFileAuditsToOldUploadDownloadActionAudits,
  transformOldUploadDownloadAccessAuditsToNewFileAudits
} from "./transformUploadDownloadActionAudits";
import {
  revertDataChangeAuditsToLegacyDataChangeAudits,
  transformLegacyDataChangeAuditsToDataChangeAudits
} from "./transformLegacyDataChangeAuditsToDataChangeAudits";
import {
  transformLegacyDataAccessAuditsToOldAccessActionAudits,
  transformOldAccessActionAuditsToLegacyDataAccessAudits
} from "./transformOldAccessActionAuditsToLegacyDataAccessAudits";

export const runAllAuditMigrationHelpers = async transaction => {
  console.log("Starting transformOldAuthenticationAuditsToNew");
  await transformOldAuthenticationAuditsToNew(transaction);
  console.log("Finished transformOldAuthenticationAuditsToNew");

  console.log("Starting transformOldDataAccessAuditsToNew");
  await transformOldDataAccessAuditsToNew(transaction);
  console.log("Finished transformOldDataAccessAuditsToNew");

  console.log("Starting transformOldExportAuditsToNew");
  await transformOldExportAuditsToNew(transaction);
  console.log("Finished transformOldExportAuditsToNew");

  // Transform old upload download access audits is dependent on copy attachment audits running first
  console.log("Starting copyAttachmentDataChangeAuditsToActionAudits");
  await copyAttachmentDataChangeAuditsToActionAudits(transaction);
  console.log("Finished copyAttachmentDataChangeAuditsToActionAudits");
  console.log("Starting transformOldUploadDownloadAccessAuditsToNewFileAudits");
  await transformOldUploadDownloadAccessAuditsToNewFileAudits(transaction);
  console.log(
    "Finishing transformOldUploadDownloadAccessAuditsToNewFileAudits"
  );

  console.log("Starting transformLegacyDataChangeAuditsToDataChangeAudits");
  await transformLegacyDataChangeAuditsToDataChangeAudits(transaction);
  console.log("Finished transformLegacyDataChangeAuditsToDataChangeAudits");

  console.log(
    "Starting transformOldAccessActionAuditsToLegacyDataAccessAudits"
  );
  await transformOldAccessActionAuditsToLegacyDataAccessAudits(transaction);
  console.log(
    "Finished transformOldAccessActionAuditsToLegacyDataAccessAudits"
  );
};

export const undoAllAuditMigrationHelpers = async transaction => {
  await transformLegacyDataAccessAuditsToOldAccessActionAudits(transaction);

  await revertDataChangeAuditsToLegacyDataChangeAudits(transaction);
  // Delete upload attachment is dependent on transform old to new being run before it
  await transformNewFileAuditsToOldUploadDownloadActionAudits(transaction);
  await deleteUploadAttachmentAudits(transaction);

  await transformNewExportAuditsToOld(transaction);

  await transformNewDataAccessAuditsToOld(transaction);

  await transformNewAuthenticationAuditsToOld(transaction);
};
