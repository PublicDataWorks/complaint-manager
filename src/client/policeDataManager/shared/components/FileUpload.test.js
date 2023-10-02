import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../createConfiguredStore";
import FileUpload from "./FileUpload";

describe("FileUpload", () => {
  test("should format an integer megabyte max size correctly and properly format file types", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <FileUpload
            allowedFileTypes={[
              "fake/lsd",
              "application/json",
              "image/jpeg",
              "stuff"
            ]}
            maxSize={10}
            onInit={jest.fn()}
            onSending={jest.fn()}
            postUrl="https://fake.url"
            setAttachmentValid={jest.fn()}
            setUploadInProgress={jest.fn()}
            snackbarError={jest.fn()}
            snackbarSuccess={jest.fn()}
          />
        </Router>
      </Provider>
    );

    expect(
      screen.getByText(
        "Max file size: 10MB, Accepted file types: lsd, json, jpeg, stuff"
      )
    ).toBeInTheDocument();
  });

  test("should format a fractional megabyte max size correctly and properly format file types", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <FileUpload
            allowedFileTypes={["application/json"]}
            maxSize={10.32}
            onInit={jest.fn()}
            onSending={jest.fn()}
            postUrl="https://fake.url"
            setAttachmentValid={jest.fn()}
            setUploadInProgress={jest.fn()}
            snackbarError={jest.fn()}
            snackbarSuccess={jest.fn()}
          />
        </Router>
      </Provider>
    );

    expect(
      screen.getByText("Max file size: 10.3MB, Accepted file types: json")
    ).toBeInTheDocument();
  });

  test("should format an integer gigabyte max size correctly and properly format file types", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <FileUpload
            allowedFileTypes={["application/json"]}
            maxSize={4000}
            onInit={jest.fn()}
            onSending={jest.fn()}
            postUrl="https://fake.url"
            setAttachmentValid={jest.fn()}
            setUploadInProgress={jest.fn()}
            snackbarError={jest.fn()}
            snackbarSuccess={jest.fn()}
          />
        </Router>
      </Provider>
    );

    expect(
      screen.getByText("Max file size: 4GB, Accepted file types: json")
    ).toBeInTheDocument();
  });

  test("should format a fractional gigabyte max size correctly and properly format file types", () => {
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <FileUpload
            allowedFileTypes={["application/json"]}
            maxSize={75600}
            onInit={jest.fn()}
            onSending={jest.fn()}
            postUrl="https://fake.url"
            setAttachmentValid={jest.fn()}
            setUploadInProgress={jest.fn()}
            snackbarError={jest.fn()}
            snackbarSuccess={jest.fn()}
          />
        </Router>
      </Provider>
    );

    expect(
      screen.getByText("Max file size: 75.6GB, Accepted file types: json")
    ).toBeInTheDocument();
  });

  test("should display an external error message when given", () => {
    const ERROR = "I'm sorry, Dave. I can't do that";
    render(
      <Provider store={createConfiguredStore()}>
        <Router>
          <FileUpload
            allowedFileTypes={["application/json"]}
            externalErrorMessage={ERROR}
            maxSize={75600}
            onInit={jest.fn()}
            onSending={jest.fn()}
            postUrl="https://fake.url"
            setAttachmentValid={jest.fn()}
            setUploadInProgress={jest.fn()}
            snackbarError={jest.fn()}
            snackbarSuccess={jest.fn()}
          />
        </Router>
      </Provider>
    );

    expect(screen.getByText(ERROR)).toBeInTheDocument();
  });
});
