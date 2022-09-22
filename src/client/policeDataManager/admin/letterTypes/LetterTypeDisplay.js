import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import ExpansionPanelIconButton from "../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../shared/components/StyledInfoDisplay";
import StyledExpansionPanelDetails from "../../shared/components/StyledExpansionPanelDetails";
import LetterTypeInfoDisplay from "./LetterTypeInfoDisplay";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import LetterTypeDialog from "./LetterTypeDialog";

const templateStyle = {
  maxHeight: "25em",
  overflow: "scroll",
  margin: "1em 0 1em 0",
  border: "1px solid grey",
  padding: "1em 0 1em 1em"
};

const LetterTypeDisplay = ({ letterType }) => {
  // format: undefined for no dialog, otherwise
  // { type: add/edit, data: {<existing letter type data>} }
  const [dialog, setDialog] = useState();

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingRight: 0
        }}
      >
        <ExpansionPanel
          data-testid="letterTypesPanel"
          elevation={0}
          style={{ backgroundColor: "white", width: "100%" }}
        >
          <ExpansionPanelSummary style={{ padding: "0px 24px" }}>
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
                    value={letterType.type}
                    testLabel="letter-type"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Requires Approval"
                    value={letterType.requiresApproval}
                    testLabel="requires-approval"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Is Editable"
                    value={letterType.hasEditPage}
                    testLabel="is-editable"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Default Sender"
                    value={letterType.defaultSender.name}
                    testLabel="default-sender"
                  />
                </StyledInfoDisplay>
                <StyledInfoDisplay>
                  <LetterTypeInfoDisplay
                    displayLabel="Required Status"
                    value={letterType.requiredStatus.name}
                    testLabel="required-status"
                  />
                </StyledInfoDisplay>
              </div>
            </div>
          </ExpansionPanelSummary>
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
                  dangerouslySetInnerHTML={{ __html: getHeadlessTemplate() }}
                />
              </StyledInfoDisplay>
              <br />
              {letterType.hasEditPage ? (
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
                      __html: `${letterType.editableTemplate}`
                    }}
                  />
                </StyledInfoDisplay>
              ) : (
                ""
              )}
            </div>
          </StyledExpansionPanelDetails>
        </ExpansionPanel>
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
            onClick={() => setDialog({ type: "edit", data: letterType })}
          >
            Edit
          </PrimaryButton>
        </section>
      </div>
      <Divider />
      {dialog ? (
        <LetterTypeDialog
          letterType={dialog.data}
          type={dialog.type}
          exit={() => setDialog()}
        />
      ) : (
        ""
      )}
    </div>
  );

  function getHeadlessTemplate() {
    const frontTemplate = letterType.template.split("<head>");
    const backTemplate = letterType.template.split("</head>");
    return frontTemplate[0] + backTemplate[1];
  }
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(LetterTypeDisplay);
