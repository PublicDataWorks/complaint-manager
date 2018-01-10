import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import allCasesReducer from './cases/allCasesReducer'
import caseCreationReducer from "./cases/caseCreationReducer"
import allUsersReducer from "./users/allUsersReducer";
import userCreationReducer from "./users/userCreationReducer";

const rootReducer = combineReducers({
    form: formReducer,
    cases: combineReducers({
         all: allCasesReducer,
         creation: caseCreationReducer
    }),
    users: combineReducers({
        all: allUsersReducer,
        creation: userCreationReducer
    })
})

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
))

export default store
