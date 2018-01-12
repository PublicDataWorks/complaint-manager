import React from 'react';
import {mount} from "enzyme/build/index";
import {Provider} from 'react-redux';
import getCases from "./cases/thunks/getCases";
import {getCasesSuccess} from './cases/actionCreators';
import store from "./reduxStore";
import App from "./App";

jest.mock("./cases/thunks/getCases", () => () => ({
  type: 'MOCK_GET_CASES_THUNK'
}));

describe('cases table', () => {
  let table, cases, dispatchSpy;

  beforeEach(() => {
    dispatchSpy = jest.spyOn(store, 'dispatch');

    cases = [{
      id: 17,
      firstName: 'Chuck',
      lastName: 'Berry',
      status: 'Initial',
      createdAt: new Date(2015, 8, 13).toISOString()
    }, {
      id: 24,
      firstName: 'Ariel',
      lastName: 'Pink',
      status: 'Initial',
      createdAt: new Date().toISOString()
    }];

    store.dispatch(getCasesSuccess(cases));
    table = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  });

  test('should load all cases when mounted', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getCases());
  })
});
