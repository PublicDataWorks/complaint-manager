import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import allCasesReducer from './cases/reducers/allCasesReducer'
import caseCreationReducer from "./cases/reducers/caseCreationReducer"
import allUsersReducer from "./users/reducers/allUsersReducer";
import userCreationReducer from "./users/reducers/userCreationReducer";
import redirectToCaseDetailReducer from "./cases/reducers/redirectToCaseDetailReducer";

const rootReducer = combineReducers({
    form: formReducer,
    cases: combineReducers({
        all: allCasesReducer,
        creation: caseCreationReducer,
        redirectToCaseDetail: redirectToCaseDetailReducer
    }),
    users: combineReducers({
        all: allUsersReducer,
        creation: userCreationReducer
    })
})

const createConfiguredStore = () => createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
))

export default createConfiguredStore
