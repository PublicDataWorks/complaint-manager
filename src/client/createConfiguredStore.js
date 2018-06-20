import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as formReducer } from "redux-form";
import thunk from "redux-thunk";
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
import incidentDetailsDialogReducer from "./reducers/ui/incidentDetailsDialogReducer";
import recentActivityReducer from "./reducers/cases/recentActivityReducer";
import caseNoteDialogReducer from "./reducers/ui/caseNoteDialogReducer";
import removePersonDialogReducer from "./reducers/ui/removePersonDialogReducer";
import removeCaseNoteDialogReducer from "./reducers/ui/removeCaseNoteDialogReducer";
import searchReducer from "./reducers/ui/searchReducer";
import allegationMenuDisplay from "./reducers/ui/allegationMenuDisplay";
import createCaseDialogReducer from "./reducers/ui/createCaseDialogReducer";
import updateCaseStatusDialogReducer from "./reducers/ui/updateCaseStatusDialogReducer";

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  cases: combineReducers({
    all: allCasesReducer
  }),
  currentCase: combineReducers({
    details: caseDetailsReducer,
    recentActivity: recentActivityReducer,
    caseHistory: caseHistoryReducer
  }),
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
    removePersonDialog: removePersonDialogReducer,
    removeCaseNoteDialog: removeCaseNoteDialogReducer,
    incidentDetailsDialog: incidentDetailsDialogReducer,
    attachments: attachmentsReducer,
    search: searchReducer,
    allegations: allegationMenuDisplay
  }),
  officers: searchOfficersReducer
});

const routingMiddleware = routerMiddleware(history);

const createConfiguredStore = () =>
  createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, routingMiddleware))
  );

export default createConfiguredStore;
