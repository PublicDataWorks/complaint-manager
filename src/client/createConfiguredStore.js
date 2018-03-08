import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import history from './history'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import allCasesReducer from './reducers/cases/allCasesReducer'
import allUsersReducer from "./reducers/users/allUsersReducer";
import snackbarReducer from "./reducers/ui/snackbarReducer";
import caseDetailsReducer from "./reducers/cases/caseDetailsReducer";
import casesTableReducer from "./reducers/ui/casesTableReducer";
import editDialogReducer from "./reducers/ui/editDialogReducer";
import userInfoReducer from "./auth/reducers/userInfoReducer";
import attachmentsReducer from "./reducers/ui/attachmentsReducer";

const rootReducer = combineReducers({
    form: formReducer,
    routing: routerReducer,
    cases: combineReducers({
        all: allCasesReducer
    }),
    currentCase: caseDetailsReducer,
    users: combineReducers({
        all: allUsersReducer,
        current: userInfoReducer

    }),
    ui: combineReducers({
        snackbar: snackbarReducer,
        casesTable: casesTableReducer,
        editCivilianDialog: editDialogReducer,
        attachments: attachmentsReducer
    })

})

const routingMiddleware = routerMiddleware(history)

const createConfiguredStore = () => createStore(rootReducer, composeWithDevTools(
    applyMiddleware(
        thunk,
        routingMiddleware
    )
))

export default createConfiguredStore
