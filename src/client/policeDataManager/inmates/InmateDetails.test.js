import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import nock from "nock";
import createConfiguredStore from "../../createConfiguredStore";
import InmateDetails from "./InmateDetails";
import {
  COMPLAINANT,
  GET_FACILITIES,
  WITNESS
} from "../../../sharedUtilities/constants";
import { push } from "connected-react-router";
import SharedSnackbarContainer from "../shared/components/SharedSnackbarContainer";

describe("Inmate details", () => {
  let dispatchSpy;
  beforeEach(() => {
    const store = createConfiguredStore();
    store.dispatch({
      type: GET_FACILITIES,
      payload: [{ name: "BIKINI BOTTOM" }]
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <Router>
          <InmateDetails match={{ params: { id: "1", roleOnCase: WITNESS } }} />
          <SharedSnackbarContainer />
        </Router>
      </Provider>
    );
  });

  test("should render Selected Manually Add Person in Custody", () => {
    expect(screen.getByText("Selected Manually Add Person in Custody"));
  });

  test("should successfully submit and redirect when first name, middle initial, and last name are entered", async () => {
    const postNock = nock("http://localhost")
      .post("/api/cases/1/inmates", {
        roleOnCase: WITNESS,
        firstName: "Stringer",
        middleInitial: "R",
        lastName: "Bell"
      })
      .reply(200);

    userEvent.type(screen.getByTestId("firstNameField"), "Stringer");
    userEvent.type(screen.getByTestId("middleInitialField"), "R");
    userEvent.type(screen.getByTestId("lastNameField"), "Bell");
    userEvent.click(screen.getByText("Create and View"));
    expect(
      await screen.findByText("Successfully added Person in Custody to case")
    );
    expect(postNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });

  test("should successfully submit and redirect when id, facility, and notes are entered", async () => {
    const postNock = nock("http://localhost")
      .post("/api/cases/1/inmates", {
        roleOnCase: WITNESS,
        notFoundInmateId: "A1234567",
        facility: "BIKINI BOTTOM",
        notes: "He lived in a pineapple under the sea"
      })
      .reply(200);

    userEvent.type(screen.getByTestId("inmateIdField"), "A1234567");
    userEvent.click(screen.getByTestId("facilityField"));
    userEvent.click(await screen.getByText("BIKINI BOTTOM"));
    userEvent.type(
      screen.getByTestId("notesField"),
      "He lived in a pineapple under the sea"
    );
    userEvent.click(screen.getByText("Create and View"));
    expect(
      await screen.findByText("Successfully added Person in Custody to case")
    );
    expect(postNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });

  test("should successfully submit and redirect when anonymize checkbox is clicked and one field is entered", async () => {
    const postNock = nock("http://localhost")
      .post("/api/cases/1/inmates", {
        roleOnCase: WITNESS,
        notFoundInmateId: "A1234567"
      })
      .reply(200);

    userEvent.click(screen.getByTestId("isInmateAnonymous"));
    userEvent.type(screen.getByTestId("inmateIdField"), "A1234567");
    userEvent.click(screen.getByText("Create and View"));
    expect(
      await screen.findByText("Successfully added Person in Custody to case")
    );
    expect(postNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });
});
