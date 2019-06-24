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

export const runAllAuditMigrationHelpers = async transaction => {
  await transformOldAuthenticationAuditsToNew(transaction);

  await transformOldDataAccessAuditsToNew(transaction);

  await transformOldExportAuditsToNew(transaction);

  // Transform old upload download access audits is dependent on copy attachment audits running first
  await copyAttachmentDataChangeAuditsToActionAudits(transaction);
  await transformOldUploadDownloadAccessAuditsToNewFileAudits(transaction);

  await transformLegacyDataChangeAuditsToDataChangeAudits(transaction);
};

export const undoAllAuditMigrationHelpers = async transaction => {
  await revertDataChangeAuditsToLegacyDataChangeAudits(transaction);
  // Delete upload attachment is dependent on transform old to new being run before it
  await transformNewFileAuditsToOldUploadDownloadActionAudits(transaction);
  await deleteUploadAttachmentAudits(transaction);

  await transformNewExportAuditsToOld(transaction);

  await transformNewDataAccessAuditsToOld(transaction);

  await transformNewAuthenticationAuditsToOld(transaction);
};
