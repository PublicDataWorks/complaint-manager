import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import nock from "nock";
import createConfiguredStore from "../../createConfiguredStore";
import InmatesSearch from "./InmatesSearch";
import { COMPLAINANT } from "../../../sharedUtilities/constants";
import SharedSnackbarContainer from "../shared/components/SharedSnackbarContainer";
import { push } from "connected-react-router";

describe("InmatesSearch", () => {
  let dispatchSpy;
  beforeEach(async () => {
    nock("http://localhost").get("/api/cases/1").reply(200, {
      id: 1,
      caseReference: "PiC2023-0001"
    });

    nock("http://localhost")
      .get("/api/facilities")
      .reply(200, [
        { id: 1, abbreviation: "ABC", name: "ABC Pest and Lawn" },
        { id: 2, abbreviation: "CBS", name: "Columbia Broadcast System" }
      ]);

    const store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    render(
      <Provider store={store}>
        <BrowserRouter>
          <InmatesSearch
            match={{ params: { id: "1", roleOnCase: COMPLAINANT } }}
          />
          <SharedSnackbarContainer />
        </BrowserRouter>
      </Provider>
    );

    await screen.findByTestId("inmate-search-title");
  });

  test("should reject empty search", () => {
    expect(screen.getByTestId("inmateSearchSubmitButton").disabled).toBeTrue();
  });

  test("should allow search by inmate id once two characters are entered", async () => {
    const searchNock = nock("http://localhost")
      .get("/api/inmates/search?inmateId=A0&page=1")
      .reply(200, {
        count: 1,
        rows: [
          {
            firstName: "Bob",
            lastName: "Loblaw",
            fullName: "Bob Loblaw",
            inmateId: "A0000001",
            facility: "WCF",
            gender: "MALE",
            race: "WHITE",
            age: 14
          }
        ]
      });

    userEvent.type(screen.getByTestId("idField"), "A0");
    userEvent.click(screen.getByTestId("inmateSearchSubmitButton"));

    expect(await screen.findByText("1 result found")).toBeInTheDocument;
    expect(await screen.findByText("Bob Loblaw")).toBeInTheDocument;
    expect(searchNock.isDone()).toBeTrue();
  });

  test("should allow search by facility if facility is selected and clicking Select will submit and redirect to case dashboard", async () => {
    const searchNock = nock("http://localhost")
      .get("/api/inmates/search?facility=1&page=1")
      .reply(200, {
        count: 1,
        rows: [
          {
            firstName: "Bob",
            lastName: "Loblaw",
            fullName: "Bob Loblaw",
            inmateId: "A0000001",
            facility: "WCF",
            gender: "MALE",
            race: "WHITE",
            age: 14
          }
        ]
      });

    userEvent.click(screen.getByTestId("facility-input"));
    userEvent.click(await screen.findByText("ABC Pest and Lawn"));
    userEvent.click(screen.getByTestId("inmateSearchSubmitButton"));

    expect(await screen.findByText("1 result found")).toBeInTheDocument;
    expect(await screen.findByText("Bob Loblaw")).toBeInTheDocument;
    expect(searchNock.isDone()).toBeTrue();

    const selectNock = nock("http://localhost")
      .post("/api/cases/1/inmates", {
        inmateId: "A0000001",
        roleOnCase: COMPLAINANT
      })
      .reply(200);
    userEvent.click(screen.getByText("SELECT"));
    expect(
      await screen.findByText("Person in Custody Successfully Added to Case")
    ).toBeInTheDocument;
    expect(selectNock.isDone()).toBeTrue();
    expect(dispatchSpy).toHaveBeenCalledWith(push("/cases/1"));
  });
});
