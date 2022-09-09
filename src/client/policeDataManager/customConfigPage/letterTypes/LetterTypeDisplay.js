import React from "react";
import { connect } from "react-redux";
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary
} from "@material-ui/core";
import ExpansionPanelIconButton from "../../shared/components/ExpansionPanelIconButton";
import StyledInfoDisplay from "../../shared/components/StyledInfoDisplay";

const LetterTypeDisplay = ({ title }) => {
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
              <div>
                <StyledInfoDisplay>
                  <div>{title}</div>
                </StyledInfoDisplay>
              </div>
            </div>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
      <Divider />
    </div>
  );
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(LetterTypeDisplay);
