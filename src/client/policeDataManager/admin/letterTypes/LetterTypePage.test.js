import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import createConfiguredStore from "../../../createConfiguredStore";
import SharedSnackbarContainer from "../../shared/components/SharedSnackbarContainer";
import {
  CASE_STATUSES_RETRIEVED,
  GET_SIGNERS,
  SET_LETTER_TYPE_TO_EDIT
} from "../../../../sharedUtilities/constants";
import LetterTypePage, { reassembleTemplate } from "./LetterTypePage";

describe("LetterTypePage", () => {
  describe("Add/Edit", () => {
    let store;

    beforeEach(() => {
      store = createConfiguredStore();

      store.dispatch({
        type: GET_SIGNERS,
        payload: [
          { name: "Billy", nickname: "bill@billy.bil" },
          { name: "ABC Pest and Lawn", nickname: "abcpestandlawn@gmail.com" },
          { name: "Rob Ot", nickname: "beeboop@gmail.com" }
        ]
      });

      store.dispatch({
        type: CASE_STATUSES_RETRIEVED,
        payload: [{ name: "Initial" }, { name: "Active" }, { name: "Closed" }]
      });
    });

    describe("Edit Letter Type", () => {
      beforeEach(() => {
        store.dispatch({
          type: SET_LETTER_TYPE_TO_EDIT,
          payload: {
            id: 1,
            type: "REFERRAL",
            template: "<section>Hello World</section>",
            hasEditPage: true,
            requiresApproval: true,
            defaultSender: {
              name: "Billy",
              nickname: "bill@billy.bil"
            },
            requiredStatus: "Active"
          }
        });

        render(
          <Provider store={store}>
            <Router>
              <LetterTypePage />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should display existing data on dialog inputs", () => {
        expect(screen.getByTestId("letter-type-input").value).toEqual(
          "REFERRAL"
        );
        expect(
          screen.getByTestId("requires-approval-checkbox").checked
        ).toBeTrue();
        expect(screen.getByTestId("edit-page-checkbox").checked).toBeTrue();
        expect(screen.getByTestId("default-sender-dropdown").value).toEqual(
          "Billy"
        );
        expect(screen.getByTestId("required-status-dropdown").value).toEqual(
          "Active"
        );
      });

      test("should call edit letter type endpoint when save is clicked", async () => {
        const editCall = nock("http://localhost")
          .put("/api/letter-types/1")
          .reply(200, {
            id: 1,
            type: "NEW TYPE",
            template: "<section>Hello World</section>",
            hasEditPage: false,
            requiresApproval: false,
            defaultSender: "abcpestandlawn@gmail.com",
            requiredStatus: "Closed"
          });

        userEvent.click(screen.getByTestId("letter-type-input"));
        userEvent.clear(screen.getByTestId("letter-type-input"));
        userEvent.type(screen.getByTestId("letter-type-input"), "NEW TYPE");

        userEvent.click(screen.getByTestId("requires-approval-checkbox"));
        userEvent.click(screen.getByTestId("edit-page-checkbox"));

        userEvent.click(screen.getByTestId("default-sender-dropdown"));
        userEvent.click(screen.getByText("ABC Pest and Lawn"));

        userEvent.click(screen.getByTestId("required-status-dropdown"));
        userEvent.click(screen.getByText("Closed"));

        userEvent.click(screen.getByText("Save"));

        expect(await screen.findByText("Successfully edited letter type"))
          .toBeInTheDocument;
        expect(editCall.isDone()).toBeTrue();
      });
    });

    describe("Add Letter Type", () => {
      beforeEach(() => {
        render(
          <Provider store={store}>
            <Router>
              <LetterTypePage />
              <SharedSnackbarContainer />
            </Router>
          </Provider>
        );
      });

      test("should add a new letter type", async () => {
        const addCall = nock("http://localhost")
          .post("/api/letter-types")
          .reply(200, {
            type: "NEW NEW TYPE",
            template: "<section>Hello World</section>",
            hasEditPage: false,
            requiresApproval: false,
            defaultSender: "beeboop@gmail.com",
            requiredStatus: "Initial"
          });

        userEvent.click(screen.getByTestId("letter-type-input"));
        userEvent.clear(screen.getByTestId("letter-type-input"));
        userEvent.type(screen.getByTestId("letter-type-input"), "NEW NEW TYPE");

        userEvent.click(screen.getByTestId("default-sender-dropdown"));
        userEvent.click(screen.getByText("Rob Ot"));

        userEvent.click(screen.getByTestId("required-status-dropdown"));
        userEvent.click(screen.getByText("Initial"));

        userEvent.click(screen.getByText("Save"));

        expect(await screen.findByText("Successfully added letter type"))
          .toBeInTheDocument;
        expect(addCall.isDone()).toBeTrue();
      });
    });
  });

  describe("reassembleTemplate", () => {
    test("should assemble all template data into a string", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            subsequentPageHeader: "look for me on the other pages",
            footerImage: "pretend I'm an image",
            footerText: "This is the footer",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return first page header div if firstPageHeader is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            subsequentPageHeader: "look for me on the other pages",
            footerImage: "pretend I'm an image",
            footerText: "This is the footer",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return subsequent page header div if subsequentPageHeader is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            footerImage: "pretend I'm an image",
            footerText: "This is the footer",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer image span if footerImage is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            subsequentPageHeader: "look for me on the other pages",
            footerText: "This is the footer",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer text if footerText is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            subsequentPageHeader: "look for me on the other pages",
            footerImage: "pretend I'm an image",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not return footer div if both footerText and footerImage are undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            I want to abolish policing!
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            subsequentPageHeader: "look for me on the other pages",
            template: "I want to abolish policing!"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });

    test("should not show undefined if template is undefined", () => {
      const expected = `<html>
          <head>
            Hi, I'm the head
          </head>
          <body>
            <div id="pageHeader-first">Look for me on the first page</div>
            <div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">look for me on the other pages</div>
            <div id="pageFooter" style="text-align: center; margin-top: 16px">
              <span style="display:inline-block; margin: 6px 16px 0 0">pretend I'm an image</span>
              <span style="display:inline-block; font-size:7pt; color: #7F7F7F;">This is the footer</span>
              <span style="display:inline-block; width: 46px">&nbsp;</span>
            </div>
          </body>
        </html>`;
      expect(
        reassembleTemplate(
          {
            firstPageHeader: "Look for me on the first page",
            subsequentPageHeader: "look for me on the other pages",
            footerImage: "pretend I'm an image",
            footerText: "This is the footer"
          },
          "Hi, I'm the head"
        ).replaceAll(/\s/gi, "")
      ).toEqual(expected.replaceAll(/\s/gi, ""));
    });
  });
});
