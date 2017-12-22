import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
import casesReducer from './cases/casesReducer'

const rootReducer = combineReducers({
    form: formReducer,
    cases: casesReducer
});

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;
