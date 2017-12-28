import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
import allCasesReducer from './cases/allCasesReducer'

const rootReducer = combineReducers({
    form: formReducer,
    cases: combineReducers({
         all: allCasesReducer,
         // creation: caseCreationReducer
    })
});

// caseCreationReducer:
//     case CASE_CREATION_SUCCESS:
//         inProgress: false
//     case CASE_CREATION_REQUESTED:
//         inProgress: true

// state: {
//     cases: {
//         all: [...],
//         creation: {
//             inProgress: true
//         }
//     }
// }



const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;
