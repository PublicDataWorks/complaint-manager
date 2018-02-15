import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import history from './history'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import allCasesReducer from './cases/reducers/allCasesReducer'
import allUsersReducer from "./users/reducers/allUsersReducer";
import snackbarReducer from "./snackbar/snackbarReducer";
import caseDetailsReducer from "./cases/reducers/caseDetailsReducer";
import casesTableReducer from "./cases/reducers/casesTableReducer";
import editDialogReducer from "./cases/reducers/editDialogReducer";
import userInfoReducer from "./auth/reducers/userInfoReducer";

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
        editCivilianDialog: editDialogReducer
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
