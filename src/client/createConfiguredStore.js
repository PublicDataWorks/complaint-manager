import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import history from "./history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import workingCasesReducer from "./policeDataManager/reducers/cases/workingCasesReducer";
import snackbarReducer from "./policeDataManager/reducers/ui/snackbarReducer";
import caseDetailsReducer from "./policeDataManager/reducers/cases/caseDetailsReducer";
import caseHistoryReducer from "./policeDataManager/reducers/cases/caseHistoryReducer";
import casesTableReducer from "./policeDataManager/reducers/ui/casesTableReducer";
import civilianDialogReducer from "./policeDataManager/reducers/ui/civilianDialogReducer";
import loggedInUserReducer from "./common/auth/reducers/loggedInUserReducer";
import attachmentsReducer from "./policeDataManager/reducers/ui/attachmentsReducer";
import searchOfficersReducer from "./policeDataManager/reducers/officers/searchOfficersReducer";
import caseNotesReducer from "./policeDataManager/reducers/cases/caseNotesReducer";
import caseNoteDialogReducer from "./policeDataManager/reducers/ui/caseNoteDialogReducer";
import removePersonDialogReducer from "./policeDataManager/reducers/ui/removePersonDialogReducer";
import removeCaseNoteDialogReducer from "./policeDataManager/reducers/ui/removeCaseNoteDialogReducer";
import searchCasesReducer from "./policeDataManager/reducers/cases/searchCasesReducer";
import searchReducer from "./policeDataManager/reducers/ui/searchReducer";
import allegationMenuDisplay from "./policeDataManager/reducers/ui/allegationMenuDisplay";
import createDialogReducer from "./common/reducers/ui/createDialogReducer";
import updateCaseStatusDialogReducer from "./policeDataManager/reducers/ui/updateCaseStatusDialogReducer";
import accusedOfficerPanelsReducer from "./policeDataManager/reducers/ui/accusedOfficerPanelsReducer";
import editAllegationFormsReducer from "./policeDataManager/reducers/ui/editAllegationFormsReducer";
import removeOfficerAllegationDialogReducer from "./policeDataManager/reducers/ui/removeOfficerAllegationDialogReducer";
import exportDialogReducer from "./policeDataManager/reducers/ui/exportDialogReducer";
import featureTogglesReducer from "./policeDataManager/reducers/featureToggles/featureTogglesReducer";
import addressInputReducer from "./policeDataManager/reducers/ui/addressInputReducer";
import officerHistoryNoteDialogReducer from "./policeDataManager/reducers/ui/officerHistoryNoteDialogReducer";
import referralLetterReducer from "./policeDataManager/reducers/cases/referralLetterReducer";
import exportJobDownloadUrlReducer from "./policeDataManager/reducers/export/exportJobDownloadUrlReducer";
import generateJobReducer from "./policeDataManager/reducers/export/generateJobReducer";
import allExportsReducer from "./policeDataManager/reducers/ui/allExportsReducer";
import recommendedActionsReducer from "./policeDataManager/reducers/cases/recommendedActionsReducer";
import editReferralLetterReducer from "./policeDataManager/reducers/ui/editReferralLetterReducer";
import cancelEditLetterConfirmationDialogReducer from "./policeDataManager/reducers/ui/cancelEditlLetterConfirmationDialogReducer";
import letterDownloadReducer from "./policeDataManager/reducers/ui/letterDownloadReducer";
import loadPdfPreviewReducer from "./policeDataManager/reducers/ui/loadPdfPreviewReducer";
import intakeSourceReducer from "./policeDataManager/reducers/ui/intakeSourceReducer";
import raceEthnicityReducer from "./policeDataManager/reducers/ui/raceEthnicityReducer";
import archiveCaseDialogReducer from "./policeDataManager/reducers/ui/archiveCaseDialogReducer";
import editIncidentDetailsDialogReducer from "./policeDataManager/reducers/ui/editIncidentDetailsDialogReducer";
import restoreArchivedCaseDialogReducer from "./policeDataManager/reducers/ui/restoreArchivedCaseDialogReducer";
import archivedCasesReducer from "./policeDataManager/reducers/cases/archivedCasesReducer";
import removeAttachmentConfirmationDialogReducer from "./policeDataManager/reducers/ui/removeAttachmentConfirmationDialogReducer";
import officerHistoryOptionsReducer from "./policeDataManager/reducers/ui/officerHistoryOptionsReducer";
import incompleteOfficerHistoryDialogReducer from "./policeDataManager/reducers/ui/incompleteOfficerHistoryDialogReducer";
import howDidYouHearAboutUsSourceReducer from "./policeDataManager/reducers/ui/howDidYouHearAboutUsSourceReducer";
import genderIdentityReducer from "./policeDataManager/reducers/ui/genderIdentityReducer";
import caseNoteActionReducer from "./policeDataManager/reducers/ui/caseNoteActionReducer";
import caseTagDialogReducer from "./policeDataManager/reducers/ui/caseTagDialogReducer";
import tagReducer from "./policeDataManager/reducers/ui/tagReducer";
import incompleteClassificationsDialogReducer from "./policeDataManager/reducers/ui/incompleteClassificationsDialogReducer";
import caseTagReducer from "./policeDataManager/reducers/cases/caseTagsReducer";
import fetchingCaseTagsReducer from "./policeDataManager/reducers/cases/fetchingCaseTagsReducer";
import fetchingCaseNotesReducer from "./policeDataManager/reducers/cases/fetchingCaseNotesReducer";
import removeCaseTagDialogReducer from "./policeDataManager/reducers/ui/removeCaseTagDialogReducer";
import civilianTitleReducer from "./policeDataManager/reducers/ui/civilianTitleReducer";
import districtReducer from "./policeDataManager/reducers/ui/districtReducer";
import addOfficerReducer from "./policeDataManager/reducers/officers/addOfficerReducer";
import usersReducer from "./common/reducers/users/usersReducer";
import classificationsReducer from "./policeDataManager/reducers/cases/classificationsReducer";
import getNotificationsReducer from "./policeDataManager/reducers/notifications/getNotificationsReducer";
import highlightCaseNoteReducer from "./policeDataManager/reducers/ui/highlightCaseNoteReducer";
import missingComplainantDialogReducer from "./policeDataManager/reducers/ui/missingComplainantDialogReducer";

const rootReducer = combineReducers({
  form: formReducer,
  router: connectRouter(history),
  cases: combineReducers({
    working: workingCasesReducer,
    search: searchCasesReducer,
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
    openMissingComplainantDialog: missingComplainantDialogReducer,
    editAllegationForms: editAllegationFormsReducer,
    removeOfficerAllegationDialog: removeOfficerAllegationDialogReducer,
    accusedOfficerPanels: accusedOfficerPanelsReducer,
    addressInput: addressInputReducer,
    officerHistoryNoteDialog: officerHistoryNoteDialogReducer,
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
