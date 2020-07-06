import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import history from "./history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import workingCasesReducer from "./complaintManager/reducers/cases/workingCasesReducer";
import snackbarReducer from "./complaintManager/reducers/ui/snackbarReducer";
import caseDetailsReducer from "./complaintManager/reducers/cases/caseDetailsReducer";
import caseHistoryReducer from "./complaintManager/reducers/cases/caseHistoryReducer";
import casesTableReducer from "./complaintManager/reducers/ui/casesTableReducer";
import civilianDialogReducer from "./complaintManager/reducers/ui/civilianDialogReducer";
import loggedInUserReducer from "./common/auth/reducers/loggedInUserReducer";
import attachmentsReducer from "./complaintManager/reducers/ui/attachmentsReducer";
import searchOfficersReducer from "./complaintManager/reducers/officers/searchOfficersReducer";
import caseNotesReducer from "./complaintManager/reducers/cases/caseNotesReducer";
import caseNoteDialogReducer from "./complaintManager/reducers/ui/caseNoteDialogReducer";
import removePersonDialogReducer from "./complaintManager/reducers/ui/removePersonDialogReducer";
import removeCaseNoteDialogReducer from "./complaintManager/reducers/ui/removeCaseNoteDialogReducer";
import searchReducer from "./complaintManager/reducers/ui/searchReducer";
import allegationMenuDisplay from "./complaintManager/reducers/ui/allegationMenuDisplay";
import createDialogReducer from "./common/reducers/ui/createDialogReducer";
import updateCaseStatusDialogReducer from "./complaintManager/reducers/ui/updateCaseStatusDialogReducer";
import accusedOfficerPanelsReducer from "./complaintManager/reducers/ui/accusedOfficerPanelsReducer";
import editAllegationFormsReducer from "./complaintManager/reducers/ui/editAllegationFormsReducer";
import removeOfficerAllegationDialogReducer from "./complaintManager/reducers/ui/removeOfficerAllegationDialogReducer";
import exportDialogReducer from "./complaintManager/reducers/ui/exportDialogReducer";
import featureTogglesReducer from "./complaintManager/reducers/featureToggles/featureTogglesReducer";
import addressInputReducer from "./complaintManager/reducers/ui/addressInputReducer";
import officerHistoryNoteDialogReducer from "./complaintManager/reducers/ui/officerHistoryNoteDialogReducer";
import referralLetterReducer from "./complaintManager/reducers/cases/referralLetterReducer";
import exportJobDownloadUrlReducer from "./complaintManager/reducers/export/exportJobDownloadUrlReducer";
import generateJobReducer from "./complaintManager/reducers/export/generateJobReducer";
import iaProCorrectionsReducer from "./complaintManager/reducers/ui/iaProCorrectionDialogReducer";
import allExportsReducer from "./complaintManager/reducers/ui/allExportsReducer";
import recommendedActionsReducer from "./complaintManager/reducers/cases/recommendedActionsReducer";
import editReferralLetterReducer from "./complaintManager/reducers/ui/editReferralLetterReducer";
import cancelEditLetterConfirmationDialogReducer from "./complaintManager/reducers/ui/cancelEditlLetterConfirmationDialogReducer";
import letterDownloadReducer from "./complaintManager/reducers/ui/letterDownloadReducer";
import loadPdfPreviewReducer from "./complaintManager/reducers/ui/loadPdfPreviewReducer";
import intakeSourceReducer from "./complaintManager/reducers/ui/intakeSourceReducer";
import raceEthnicityReducer from "./complaintManager/reducers/ui/raceEthnicityReducer";
import archiveCaseDialogReducer from "./complaintManager/reducers/ui/archiveCaseDialogReducer";
import editIncidentDetailsDialogReducer from "./complaintManager/reducers/ui/editIncidentDetailsDialogReducer";
import restoreArchivedCaseDialogReducer from "./complaintManager/reducers/ui/restoreArchivedCaseDialogReducer";
import archivedCasesReducer from "./complaintManager/reducers/cases/archivedCasesReducer";
import removeAttachmentConfirmationDialogReducer from "./complaintManager/reducers/ui/removeAttachmentConfirmationDialogReducer";
import officerHistoryOptionsReducer from "./complaintManager/reducers/ui/officerHistoryOptionsReducer";
import incompleteOfficerHistoryDialogReducer from "./complaintManager/reducers/ui/incompleteOfficerHistoryDialogReducer";
import howDidYouHearAboutUsSourceReducer from "./complaintManager/reducers/ui/howDidYouHearAboutUsSourceReducer";
import genderIdentityReducer from "./complaintManager/reducers/ui/genderIdentityReducer";
import caseNoteActionReducer from "./complaintManager/reducers/ui/caseNoteActionReducer";
import caseTagDialogReducer from "./complaintManager/reducers/ui/caseTagDialogReducer";
import tagReducer from "./complaintManager/reducers/ui/tagReducer";
import incompleteClassificationsDialogReducer from "./complaintManager/reducers/ui/incompleteClassificationsDialogReducer";
import caseTagReducer from "./complaintManager/reducers/cases/caseTagsReducer";
import fetchingCaseTagsReducer from "./complaintManager/reducers/cases/fetchingCaseTagsReducer";
import fetchingCaseNotesReducer from "./complaintManager/reducers/cases/fetchingCaseNotesReducer";
import removeCaseTagDialogReducer from "./complaintManager/reducers/ui/removeCaseTagDialogReducer";
import civilianTitleReducer from "./complaintManager/reducers/ui/civilianTitleReducer";
import districtReducer from "./complaintManager/reducers/ui/districtReducer";
import addOfficerReducer from "./complaintManager/reducers/officers/addOfficerReducer";
import usersReducer from "./common/reducers/users/usersReducer";
import classificationsReducer from "./complaintManager/reducers/cases/classificationsReducer";
import getNotificationsReducer from "./complaintManager/reducers/notifications/getNotificationsReducer";
import highlightCaseNoteReducer from "./complaintManager/reducers/ui/highlightCaseNoteReducer";

const rootReducer = combineReducers({
  form: formReducer,
  router: connectRouter(history),
  cases: combineReducers({
    working: workingCasesReducer,
    archived: archivedCasesReducer
  }),
  currentCase: combineReducers({
    details: caseDetailsReducer,
    caseNotes: caseNotesReducer,
    fetchingCaseNotes: fetchingCaseNotesReducer,
    caseHistory: caseHistoryReducer,
    caseTags: caseTagReducer,
    fetchingCaseTags: fetchingCaseTagsReducer
  }),
  referralLetter: referralLetterReducer,
  recommendedActions: recommendedActionsReducer,
  classifications: classificationsReducer,
  users: combineReducers({
    current: loggedInUserReducer,
    all: usersReducer
  }),
  ui: combineReducers({
    snackbar: snackbarReducer,
    casesTable: casesTableReducer,
    updateCaseStatusDialog: updateCaseStatusDialogReducer,
    caseTagDialog: caseTagDialogReducer,
    caseNoteDialog: caseNoteDialogReducer,
    civilianDialog: civilianDialogReducer,
    createDialog: createDialogReducer,
    exportDialog: exportDialogReducer,
    allExports: allExportsReducer,
    removePersonDialog: removePersonDialogReducer,
    removeCaseNoteDialog: removeCaseNoteDialogReducer,
    removeCaseTagDialog: removeCaseTagDialogReducer,
    editLetterConfirmationDialog: editReferralLetterReducer,
    cancelEditLetterConfirmationDialog: cancelEditLetterConfirmationDialogReducer,
    attachments: attachmentsReducer,
    search: searchReducer,
    caseNoteActions: caseNoteActionReducer,
    allegations: allegationMenuDisplay,
    intakeSources: intakeSourceReducer,
    howDidYouHearAboutUsSources: howDidYouHearAboutUsSourceReducer,
    raceEthnicities: raceEthnicityReducer,
    civilianTitles: civilianTitleReducer,
    districts: districtReducer,
    tags: tagReducer,
    genderIdentities: genderIdentityReducer,
    officerHistoryOptions: officerHistoryOptionsReducer,
    incompleteOfficerHistoryDialog: incompleteOfficerHistoryDialogReducer,
    openIncompleteClassificationsDialog: incompleteClassificationsDialogReducer,
    editAllegationForms: editAllegationFormsReducer,
    removeOfficerAllegationDialog: removeOfficerAllegationDialogReducer,
    accusedOfficerPanels: accusedOfficerPanelsReducer,
    addressInput: addressInputReducer,
    officerHistoryNoteDialog: officerHistoryNoteDialogReducer,
    iaProCorrectionsDialog: iaProCorrectionsReducer,
    letterDownload: letterDownloadReducer,
    pdfPreview: loadPdfPreviewReducer,
    archiveCaseDialog: archiveCaseDialogReducer,
    restoreArchivedCaseDialog: restoreArchivedCaseDialogReducer,
    editIncidentDetailsDialog: editIncidentDetailsDialogReducer,
    removeAttachmentConfirmationDialog: removeAttachmentConfirmationDialogReducer,
    highlightedCaseNote: highlightCaseNoteReducer
  }),
  officers: combineReducers({
    searchOfficers: searchOfficersReducer,
    addOfficer: addOfficerReducer
  }),
  featureToggles: featureTogglesReducer,
  export: combineReducers({
    downloadUrl: exportJobDownloadUrlReducer,
    generateJob: generateJobReducer
  }),
  notifications: getNotificationsReducer
});

const routingMiddleware = routerMiddleware(history);

const createConfiguredStore = () =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, routingMiddleware))
  );

export default createConfiguredStore;
