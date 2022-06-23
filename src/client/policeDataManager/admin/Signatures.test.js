import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Signatures from "./Signatures";
import createConfiguredStore from "../../createConfiguredStore";

describe("Signatures Admin Card", () => {
  beforeEach(() => {
    nock("http://localhost")
      .get("/api/signers")
      .reply(200, [
        {
          id: 1,
          name: "John A Simms",
          title: "Independent Police Monitor",
          nickname: "jsimms@oipm.gov",
          phone: "888-576-9922",
          links: [
            {
              rel: "signature",
              href: "/api/signers/1/signature"
            }
          ]
        },
        {
          id: 2,
          name: "Nina Ambroise",
          title: "Complaint Intake Specialist",
          nickname: "nambroise@oipm.gov",
          phone: "888-576-9922",
          links: [
            {
              rel: "signature",
              href: "/api/signers/2/signature"
            }
          ]
        }
      ]);

    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <Signatures />
        </Router>
      </Provider>
    );
  });

  test("should render title and signers", async () => {
    expect(screen.getByText("Signatures")).toBeInTheDocument;
    expect(await screen.findByText("John A Simms")).toBeInTheDocument;
    expect(await screen.findByText("Nina Ambroise")).toBeInTheDocument;
    expect(await screen.findAllByText("888-576-9922")).toBeInTheDocument;
    expect(await screen.findByText("Complaint Intake Specialist"))
      .toBeInTheDocument;
  });
});
