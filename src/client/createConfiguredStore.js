import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import history from "./history";
import { routerMiddleware, routerReducer } from "react-router-redux";
import allCasesReducer from "./reducers/cases/allCasesReducer";
import allUsersReducer from "./reducers/users/allUsersReducer";
import snackbarReducer from "./reducers/ui/snackbarReducer";
import caseDetailsReducer from "./reducers/cases/caseDetailsReducer";
import caseHistoryReducer from "./reducers/cases/caseHistoryReducer";
import casesTableReducer from "./reducers/ui/casesTableReducer";
import civilianDialogReducer from "./reducers/ui/civilianDialogReducer";
import userInfoReducer from "./auth/reducers/userInfoReducer";
import attachmentsReducer from "./reducers/ui/attachmentsReducer";
import searchOfficersReducer from "./reducers/officers/searchOfficersReducer";
import caseNotesReducer from "./reducers/cases/caseNotesReducer";
import caseNoteDialogReducer from "./reducers/ui/caseNoteDialogReducer";
import removePersonDialogReducer from "./reducers/ui/removePersonDialogReducer";
import removeCaseNoteDialogReducer from "./reducers/ui/removeCaseNoteDialogReducer";
import searchReducer from "./reducers/ui/searchReducer";
import allegationMenuDisplay from "./reducers/ui/allegationMenuDisplay";
import createCaseDialogReducer from "./reducers/ui/createCaseDialogReducer";
import updateCaseStatusDialogReducer from "./reducers/ui/updateCaseStatusDialogReducer";
import accusedOfficerPanelsReducer from "./reducers/ui/accusedOfficerPanelsReducer";
import editAllegationFormsReducer from "./reducers/ui/editAllegationFormsReducer";
import removeOfficerAllegationDialogReducer from "./reducers/ui/removeOfficerAllegationDialogReducer";
import exportDialogReducer from "./reducers/ui/exportDialogReducer";
import featureTogglesReducer from "./reducers/featureToggles/featureTogglesReducer";
import addressInputReducer from "./reducers/ui/addressInputReducer";
import classificationReducer from "./reducers/ui/classificationReducer";
import officerHistoryNoteDialogReducer from "./reducers/ui/officerHistoryNoteDialogReducer";
import referralLetterReducer from "./reducers/cases/referralLetterReducer";
import exportJobDownloadUrlReducer from "./reducers/export/exportJobDownloadUrlReducer";
import generateJobReducer from "./reducers/export/generateJobReducer";
import iaProCorrectionsReducer from "./reducers/ui/iaProCorrectionDialogReducer";
import allExportsReducer from "./reducers/ui/allExportsReducer";
import recommendedActionsReducer from "./reducers/cases/recommendedActionsReducer";
import editReferralLetterReducer from "./reducers/ui/editReferralLetterReducer";
import { caseNoteDialogSaga } from "./sagas/ui/caseNoteDialogSaga";

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  cases: combineReducers({
    all: allCasesReducer
  }),
  currentCase: combineReducers({
    details: caseDetailsReducer,
    caseNotes: caseNotesReducer,
    caseHistory: caseHistoryReducer
  }),
  referralLetter: referralLetterReducer,
  recommendedActions: recommendedActionsReducer,
  users: combineReducers({
    all: allUsersReducer,
    current: userInfoReducer
  }),
  ui: combineReducers({
    snackbar: snackbarReducer,
    casesTable: casesTableReducer,
    updateCaseStatusDialog: updateCaseStatusDialogReducer,
    caseNoteDialog: caseNoteDialogReducer,
    civilianDialog: civilianDialogReducer,
    createCaseDialog: createCaseDialogReducer,
    exportDialog: exportDialogReducer,
    allExports: allExportsReducer,
    removePersonDialog: removePersonDialogReducer,
    removeCaseNoteDialog: removeCaseNoteDialogReducer,
    editLetterConfirmationDialog: editReferralLetterReducer,
    attachments: attachmentsReducer,
    search: searchReducer,
    allegations: allegationMenuDisplay,
    classifications: classificationReducer,
    editAllegationForms: editAllegationFormsReducer,
    removeOfficerAllegationDialog: removeOfficerAllegationDialogReducer,
    accusedOfficerPanels: accusedOfficerPanelsReducer,
    addressInput: addressInputReducer,
    officerHistoryNoteDialog: officerHistoryNoteDialogReducer,
    iaProCorrectionsDialog: iaProCorrectionsReducer
  }),
  officers: searchOfficersReducer,
  featureToggles: featureTogglesReducer,
  export: combineReducers({
    downloadUrl: exportJobDownloadUrlReducer,
    generateJob: generateJobReducer
  })
});

function* rootSaga() {
  yield all([caseNoteDialogSaga()]);
}

const routingMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const createConfiguredStore = () => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunk, routingMiddleware, sagaMiddleware)
    )
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

export default createConfiguredStore;
