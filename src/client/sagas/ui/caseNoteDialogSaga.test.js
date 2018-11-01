import {
  addCaseNoteRequest,
  editCaseNoteRequest,
  removeCaseNoteRequest
} from "../../actionCreators/casesActionCreators";
import createSagaMiddleware, { END } from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { duration } from "@material-ui/core/styles/transitions";
import {
  CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED
} from "../../../sharedUtilities/constants";

describe("caseNoteDialogSaga", () => {
  let actions;
  const actionLoggerMiddleware = store => next => action => {
    actions.push(action);
    return next(action);
  };
  let sagaMiddleware;
  let store;
  let saga;

  beforeEach(() => {
    jest.resetModules();
    actions = [];

    sagaMiddleware = createSagaMiddleware();
    store = createStore(
      (state, action) => state,
      applyMiddleware(thunk, actionLoggerMiddleware, sagaMiddleware)
    );
  });

  test("after successful addCaseNote request, should wait for dialog close transition before accepting new requests.", async () => {
    jest.doMock("../../cases/thunks/addCaseNote", () => values => async () => {
      store.dispatch({
        type: "MOCK_SUCCEEDED",
        values
      });
      return store.dispatch({ type: CASE_NOTE_DIALOG_CLOSED });
    });

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const addRequest1 = addCaseNoteRequest({ id: 1 });
    const addRequest2 = addCaseNoteRequest({ id: 2 });
    const addRequest3 = addCaseNoteRequest({ id: 3 });
    const addRequest4 = addCaseNoteRequest({ id: 4 });

    store.dispatch(addRequest1);
    // These should be ignored because they are submitted after the first request and before the success + transition delay.
    store.dispatch(addRequest2);
    store.dispatch(addRequest3);
    // Should be accepted because it is submitted after the success and transition delay.
    // In real use, this event wouldn't happen because the dialog will have unmounted after the delay.
    setTimeout(() => {
      store.dispatch(addRequest4);
      store.dispatch(END);
    }, duration.leavingScreen + 1);
    await saga.done;

    // Check that the middle two requests were ignored, and the other two were processed.
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 1 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 2 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 3 }
    });
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 4 }
    });
  });
  test("after failed addCaseNote request, should wait for debounce duration before accepting new requests.", async () => {
    jest.doMock("../../cases/thunks/addCaseNote", () => values => async () => {
      return store.dispatch({
        type: "MOCK_FAILED",
        values
      });
    });

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const addRequest1 = addCaseNoteRequest({ id: 1 });
    const addRequest2 = addCaseNoteRequest({ id: 2 });
    const addRequest3 = addCaseNoteRequest({ id: 3 });
    const addRequest4 = addCaseNoteRequest({ id: 4 });

    store.dispatch(addRequest1);
    // Should be rejected because it is submitted within debounce delay.
    setTimeout(() => {
      store.dispatch(addRequest2);
    }, 200);
    // Should be rejected because previous request will have reset the debounce delay.
    setTimeout(() => {
      store.dispatch(addRequest3);
    }, 500);
    // Wait for entire delay duration since last request.
    setTimeout(() => {
      store.dispatch(addRequest4);
    }, 500 + 200 + 500);
    //
    setTimeout(() => {
      store.dispatch(END);
    }, 505 + 200 + 501);

    await saga.done;
    expect(actions).toContainEqual({ type: "MOCK_FAILED", values: { id: 1 } });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      values: { id: 2 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      values: { id: 3 }
    });
    expect(actions).toContainEqual({ type: "MOCK_FAILED", values: { id: 4 } });
  });
  test("after successful editCaseNote request, should wait for dialog close transition before accepting new requests.", async () => {
    jest.doMock("../../cases/thunks/editCaseNote", () => values => async () => {
      store.dispatch({
        type: "MOCK_SUCCEEDED",
        values
      });
      return store.dispatch({ type: CASE_NOTE_DIALOG_CLOSED });
    });

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const editRequest1 = editCaseNoteRequest({ id: 1 });
    const editRequest2 = editCaseNoteRequest({ id: 2 });
    const editRequest3 = editCaseNoteRequest({ id: 3 });
    const editRequest4 = editCaseNoteRequest({ id: 4 });

    store.dispatch(editRequest1);
    // These should be ignored because they are submitted after the first request and before the success + transition delay.
    store.dispatch(editRequest2);
    store.dispatch(editRequest3);
    // Should be accepted because it is submitted after the success and transition delay.
    // In real use, this event wouldn't happen because the dialog will have unmounted after the delay.
    setTimeout(() => {
      store.dispatch(editRequest4);
      store.dispatch(END);
    }, duration.leavingScreen + 1);
    await saga.done;

    // Check that the middle two requests were ignored, and the other two were processed.
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 1 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 2 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 3 }
    });
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      values: { id: 4 }
    });
  });
  test("after failed editCaseNote request, should wait for debounce duration before accepting new requests.", async () => {
    jest.doMock("../../cases/thunks/editCaseNote", () => values => async () => {
      return store.dispatch({
        type: "MOCK_FAILED",
        values
      });
    });

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const editRequest1 = editCaseNoteRequest({ id: 1 });
    const editRequest2 = editCaseNoteRequest({ id: 2 });
    const editRequest3 = editCaseNoteRequest({ id: 3 });
    const editRequest4 = editCaseNoteRequest({ id: 4 });

    store.dispatch(editRequest1);
    // Should be rejected because it is submitted within debounce delay.
    setTimeout(() => {
      store.dispatch(editRequest2);
    }, 200);
    // Should be rejected because previous request will have reset the debounce delay.
    setTimeout(() => {
      store.dispatch(editRequest3);
    }, 500);
    // Wait for entire delay duration since last request.
    setTimeout(() => {
      store.dispatch(editRequest4);
    }, 500 + 200 + 500);
    //
    setTimeout(() => {
      store.dispatch(END);
    }, 505 + 200 + 501);

    await saga.done;
    expect(actions).toContainEqual({ type: "MOCK_FAILED", values: { id: 1 } });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      values: { id: 2 }
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      values: { id: 3 }
    });
    expect(actions).toContainEqual({ type: "MOCK_FAILED", values: { id: 4 } });
  });
  test("after successful removeCaseNote request, should wait for dialog close transition before accepting new requests.", async () => {
    jest.doMock(
      "../../cases/thunks/removeCaseNote",
      () => (caseId, caseNoteId) => async () => {
        store.dispatch({
          type: "MOCK_SUCCEEDED",
          caseId,
          caseNoteId
        });
        return store.dispatch({ type: REMOVE_CASE_NOTE_DIALOG_CLOSED });
      }
    );

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const removeRequest1 = removeCaseNoteRequest(1, 1);
    const removeRequest2 = removeCaseNoteRequest(2, 2);
    const removeRequest3 = removeCaseNoteRequest(3, 3);
    const removeRequest4 = removeCaseNoteRequest(4, 4);

    store.dispatch(removeRequest1);
    // These should be ignored because they are submitted after the first request and before the success + transition delay.
    store.dispatch(removeRequest2);
    store.dispatch(removeRequest3);
    // Should be accepted because it is submitted after the success and transition delay.
    // In real use, this event wouldn't happen because the dialog will have unmounted after the delay.
    setTimeout(() => {
      store.dispatch(removeRequest4);
      store.dispatch(END);
    }, duration.leavingScreen + 1);
    await saga.done;

    // Check that the middle two requests were ignored, and the other two were processed.
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      caseId: 1,
      caseNoteId: 1
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      caseId: 2,
      caseNoteId: 2
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_SUCCEEDED",
      caseId: 3,
      caseNoteId: 3
    });
    expect(actions).toContainEqual({
      type: "MOCK_SUCCEEDED",
      caseId: 4,
      caseNoteId: 4
    });
  });
  test("after failed removeCaseNote request, should wait for debounce duration before accepting new requests.", async () => {
    jest.doMock(
      "../../cases/thunks/removeCaseNote",
      () => (caseId, caseNoteId) => async () => {
        return store.dispatch({
          type: "MOCK_FAILED",
          caseId,
          caseNoteId
        });
      }
    );

    let sagaModule = require("./caseNoteDialogSaga");
    saga = sagaMiddleware.run(sagaModule.caseNoteDialogSaga);

    const removeRequest1 = removeCaseNoteRequest(1, 1);
    const removeRequest2 = removeCaseNoteRequest(2, 2);
    const removeRequest3 = removeCaseNoteRequest(3, 3);
    const removeRequest4 = removeCaseNoteRequest(4, 4);

    store.dispatch(removeRequest1);
    // Should be rejected because it is submitted within debounce delay.
    setTimeout(() => {
      store.dispatch(removeRequest2);
    }, 200);
    // Should be rejected because previous request will have reset the debounce delay.
    setTimeout(() => {
      store.dispatch(removeRequest3);
    }, 500);
    // Wait for entire delay duration since last request.
    setTimeout(() => {
      store.dispatch(removeRequest4);
    }, 500 + 200 + 500);
    //
    setTimeout(() => {
      store.dispatch(END);
    }, 505 + 200 + 501);

    await saga.done;
    expect(actions).toContainEqual({
      type: "MOCK_FAILED",
      caseId: 1,
      caseNoteId: 1
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      caseId: 2,
      caseNoteId: 2
    });
    expect(actions).not.toContainEqual({
      type: "MOCK_FAILED",
      caseId: 3,
      caseNoteId: 3
    });
    expect(actions).toContainEqual({
      type: "MOCK_FAILED",
      caseId: 4,
      caseNoteId: 4
    });
  });
});
