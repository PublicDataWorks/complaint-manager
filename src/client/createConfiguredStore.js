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
import tagManagementReducer from "./policeDataManager/reducers/ui/tagManagementPageReducer";
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
import configReducer from "./policeDataManager/reducers/ui/configReducer";
import caseStatusesReducer from "./policeDataManager/reducers/ui/caseStatusesReducer";
import signersReducer from "./policeDataManager/reducers/signersReducer";
import editLetterTypeReducer from "./policeDataManager/reducers/ui/editLetterTypeReducer";
import complaintTypeReducer from "./policeDataManager/reducers/ui/complaintTypeReducer";
import facilitiesReducer from "./policeDataManager/reducers/facilitiesReducer";
import personTypesReducer from "./policeDataManager/reducers/personTypesReducer";

const rootReducer = combineReducers({
  cases: combineReducers({
    archived: archivedCasesReducer,
    search: searchCasesReducer,
    working: workingCasesReducer
  }),
  classifications: classificationsReducer,
  currentCase: combineReducers({
    caseHistory: caseHistoryReducer,
    caseNotes: caseNotesReducer,
    caseTags: caseTagReducer,
    details: caseDetailsReducer,
    fetchingCaseNotes: fetchingCaseNotesReducer,
    fetchingCaseTags: fetchingCaseTagsReducer
  }),
  configs: configReducer,
  export: combineReducers({
    downloadUrl: exportJobDownloadUrlReducer,
    generateJob: generateJobReducer
  }),
  featureToggles: featureTogglesReducer,
  facilities: facilitiesReducer,
  form: formReducer,
  notifications: getNotificationsReducer,
  officers: combineReducers({
    addOfficer: addOfficerReducer,
    searchOfficers: searchOfficersReducer
  }),
  personTypes: personTypesReducer,
  recommendedActions: recommendedActionsReducer,
  referralLetter: referralLetterReducer,
  router: connectRouter(history),
  signers: signersReducer,
  ui: combineReducers({
    accusedOfficerPanels: accusedOfficerPanelsReducer,
    addressInput: addressInputReducer,
    allegations: allegationMenuDisplay,
    allExports: allExportsReducer,
    archiveCaseDialog: archiveCaseDialogReducer,
    attachments: attachmentsReducer,
    cancelEditLetterConfirmationDialog:
      cancelEditLetterConfirmationDialogReducer,
    caseNoteActions: caseNoteActionReducer,
    caseNoteDialog: caseNoteDialogReducer,
    casesTable: casesTableReducer,
    caseStatuses: caseStatusesReducer,
    caseTagDialog: caseTagDialogReducer,
    civilianDialog: civilianDialogReducer,
    civilianTitles: civilianTitleReducer,
    complaintTypes: complaintTypeReducer,
    createDialog: createDialogReducer,
    districts: districtReducer,
    editAllegationForms: editAllegationFormsReducer,
    editIncidentDetailsDialog: editIncidentDetailsDialogReducer,
    editLetterConfirmationDialog: editReferralLetterReducer,
    editLetterType: editLetterTypeReducer,
    exportDialog: exportDialogReducer,
    genderIdentities: genderIdentityReducer,
    highlightedCaseNote: highlightCaseNoteReducer,
    howDidYouHearAboutUsSources: howDidYouHearAboutUsSourceReducer,
    incompleteOfficerHistoryDialog: incompleteOfficerHistoryDialogReducer,
    intakeSources: intakeSourceReducer,
    letterDownload: letterDownloadReducer,
    officerHistoryOptions: officerHistoryOptionsReducer,
    openIncompleteClassificationsDialog: incompleteClassificationsDialogReducer,
    openMissingComplainantDialog: missingComplainantDialogReducer,
    pdfPreview: loadPdfPreviewReducer,
    raceEthnicities: raceEthnicityReducer,
    removeAttachmentConfirmationDialog:
      removeAttachmentConfirmationDialogReducer,
    removeCaseNoteDialog: removeCaseNoteDialogReducer,
    removeCaseTagDialog: removeCaseTagDialogReducer,
    removeOfficerAllegationDialog: removeOfficerAllegationDialogReducer,
    restoreArchivedCaseDialog: restoreArchivedCaseDialogReducer,
    search: searchReducer,
    snackbar: snackbarReducer,
    tagManagement: tagManagementReducer,
    tags: tagReducer,
    updateCaseStatusDialog: updateCaseStatusDialogReducer
  }),
  users: combineReducers({
    current: loggedInUserReducer,
    all: usersReducer
  })
});

const routingMiddleware = routerMiddleware(history);

const createConfiguredStore = () =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, routingMiddleware))
  );

export default createConfiguredStore;
