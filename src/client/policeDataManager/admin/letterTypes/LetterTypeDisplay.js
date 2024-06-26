import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import axios from "axios";
import {
  Divider,
  Accordion,
  AccordionSummary,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import ExpansionPanelIconButton from "../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../shared/components/StyledInfoDisplay";
import StyledExpansionPanelDetails from "../../shared/components/StyledExpansionPanelDetails";
import LetterTypeInfoDisplay from "./LetterTypeInfoDisplay";
import {
  PrimaryButton,
  SecondaryButton
} from "../../shared/components/StyledButtons";
import { SET_LETTER_TYPE_TO_EDIT } from "../../../../sharedUtilities/constants";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const templateStyle = {
  maxHeight: "25em",
  overflow: "scroll",
  margin: "1em 0 1em 0",
  border: "1px solid grey",
  padding: "1em 0 1em 1em"
};

const getHeadlessTemplate = letterType => {
  const frontTemplate = letterType.template.split("<head>");
  const backTemplate = letterType.template.split("</head>");
  return frontTemplate[0] + backTemplate[1];
};

const LetterTypeDisplay = props => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingRight: 0
        }}
      >
        <Accordion
          data-testid="letterTypesPanel"
          elevation={0}
          style={{ backgroundColor: "white", width: "100%" }}
        >
          <AccordionSummary style={{ padding: "0px 24px" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                paddingRight: 0,
                marginBottom: 4
              }}
            >
              <ExpansionPanelIconButton />
              <div
                style={{
                  display: "flex",
                  width: "100%"
                }}
              >
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Type"
                    value={props.letterType.type}
                    testLabel="letter-type"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Requires Approval"
                    value={props.letterType.requiresApproval}
                    testLabel="requires-approval"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Is Editable"
                    value={props.letterType.hasEditPage}
                    testLabel="is-editable"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Default Sender"
                    value={props.letterType.defaultSender.name}
                    testLabel="default-sender"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Required Status"
                    value={props.letterType.requiredStatus}
                    testLabel="required-status"
                  />
                </StyledInfoDisplay>
              </div>
            </div>
          </AccordionSummary>
          <StyledExpansionPanelDetails>
            <div
              style={{
                width: "100%",
                marginBottom: 4
              }}
            >
              <StyledInfoDisplay>
                <Typography variant="caption" data-testid={`template-label`}>
                  Template
                </Typography>
                <div
                  style={templateStyle}
                  dangerouslySetInnerHTML={{
                    __html: getHeadlessTemplate(props.letterType)
                  }}
                />
              </StyledInfoDisplay>
              <br />
              {props.letterType.hasEditPage && (
                <StyledInfoDisplay>
                  <Typography
                    variant="caption"
                    data-testid={`body-template-label`}
                  >
                    Body Template
                  </Typography>
                  <div
                    style={templateStyle}
                    dangerouslySetInnerHTML={{
                      __html: `${props.letterType.editableTemplate}`
                    }}
                  />
                </StyledInfoDisplay>
              )}
            </div>
          </StyledExpansionPanelDetails>
        </Accordion>
        <section
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            padding: "0 30px 10px 0",
            marginTop: "25px"
          }}
        >
          <PrimaryButton
            data-testid="edit-letter-type-btn"
            onClick={() => {
              props.setLetterTypeToEdit(props.letterType);
              props.history.push("/admin-portal/letter-type");
            }}
          >
            Edit
          </PrimaryButton>
          <SecondaryButton
            data-testid="delete-letter-type-btn"
            onClick={() => {
              setDeleteDialog(true);
            }}
            style={{ marginLeft: "20px" }}
          >
            Delete
          </SecondaryButton>
        </section>
      </div>
      <Divider />
      <ConfirmationDialog
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {
          axios
            .delete(`api/letter-types/${props.letterType.id}`)
            .then(result => {
              props.reloadLetterTypes();
              props.snackbarSuccess("Letter type successfully deleted");
              setDeleteDialog(false);
            });
        }}
        onCancel={() => setDeleteDialog(false)}
        open={deleteDialog}
        title="Delete Letter Template"
        closeButton={
          <IconButton
            style={{
              float: "right",
              position: "absolute",
              right: "8px",
              top: "8px"
            }}
            onClick={() => setDeleteDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        <div style={{ fontSize: "1.1em" }}>
          <strong>
            Are you sure you want to permanently delete this letter template?
          </strong>
        </div>
        <br></br>
        By selecting "<strong>Yes</strong>", you will not be able to generate
        any new letters using this template. This action will not affect
        previously generated letters.
      </ConfirmationDialog>
    </div>
  );
};

export default connect(
  state => ({
    permissions: state?.users?.current?.userInfo?.permissions
  }),
  {
    snackbarSuccess,
    setLetterTypeToEdit: letterType => ({
      type: SET_LETTER_TYPE_TO_EDIT,
      payload: letterType
    })
  }
)(withRouter(LetterTypeDisplay));
