import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, reset } from "redux-form";
import { Octokit } from "octokit";
import { createTokenAuth } from "@octokit/auth-token";
import { Typography } from "@material-ui/core";
import standards from "../../common/globalStyling/standards";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import RichTextEditor from "../shared/components/RichTextEditor/RichTextEditor";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import { PrimaryButton } from "../shared/components/StyledButtons";
import { snackbarSuccess } from "../actionCreators/snackBarActionCreators";

const RichTextEditorComponent = props => {
  return (
    <RichTextEditor
      {...props}
      initialValue={props.input.value}
      onChange={newValue => props.input.onChange(newValue)}
    />
  );
};

const FeatureRequestPage = props => {
  const [octokit, setOctokit] = useState();
  useEffect(() => {
    const authentication = createTokenAuth(process.env.REACT_APP_GITHUB_TOKEN);
    authentication()
      .then(auth => {
        setOctokit(
          new Octokit({
            auth: auth.token
          })
        );
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const submit = async values => {
    await octokit.rest.issues.create({
      owner: "PublicDataWorks",
      repo: "complaint-manager",
      title: values.issueTitle,
      body: values.issueBody
    });
    props.snackbarSuccess("Successfully Submitted Request");
    props.reset("feature-request");
  };

  return (
    <main className="feature-request">
      <NavBar menuType={policeDataManagerMenuOptions}>Request a Feature</NavBar>
      <section style={{ margin: "30px" }}>
        <form>
          <Field
            name="issueTitle"
            label="Issue Title"
            component={renderTextField}
            fullWidth
            multiline
            maxRows={5}
            placeholder={
              props.isArchived
                ? ""
                : "Enter a brief summary of the feature or bug"
            }
            inputProps={{
              "data-testid": "issueTitleInput",
              maxLength: 500,
              style: {
                color: "black"
              }
            }}
            InputLabelProps={{
              style: {
                color: "black"
              },
              shrink: true
            }}
            data-testid="issueTitleField"
            style={{ marginBottom: "24px" }}
          />
          <Typography
            style={{
              marginBottom: "8px",
              fontSize: standards.fontTiny
            }}
          >
            Issue Body
          </Typography>
          <Field
            name="issueBody"
            label="Issue Description"
            component={RichTextEditorComponent}
            placeholder="Enter a description of the feature or bug"
            fullWidth
            multiline
            rows={5}
            inputProps={{
              "data-testid": "issueDescriptionInput",
              style: {
                color: "black"
              }
            }}
            data-testid="issueDescriptionField"
          />
          <PrimaryButton
            onClick={props.handleSubmit(submit)}
            disabled={!octokit}
          >
            Submit
          </PrimaryButton>
        </form>
      </section>
    </main>
  );
};

export default reduxForm({
  form: "feature-request"
})(connect(undefined, { snackbarSuccess, reset })(FeatureRequestPage));
