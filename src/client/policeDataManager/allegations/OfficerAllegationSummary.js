import React from "react";
import PropTypes from "prop-types";
import formatStringToTitleCase from "../utilities/formatStringToTitleCase";
import {
  AccordionSummary,
  Icon,
  IconButton,
  Typography
} from "@material-ui/core";
import LinkButton from "../shared/components/LinkButton";

const OfficerAllegationSummary = props => {
  return (
    <AccordionSummary style={{ display: "flex" }}>
      <IconButton
        style={{ marginRight: 16 }}
        color="secondary"
        className="chevron-right"
        disabled={props.editMode}
        data-testid="expandIcon"
      >
        <Icon>unfold_more</Icon>
      </IconButton>
      <div style={{ display: "flex", flex: 20 }}>
        <div style={{ flex: 1, marginRight: "24px" }}>
          <Typography variant="caption">Rule</Typography>
          <Typography>
            {formatStringToTitleCase(props.allegation.rule)}
          </Typography>
        </div>
        <div style={{ flex: "1", marginRight: "24px" }}>
          <Typography variant="caption">Paragraph</Typography>
          <Typography>
            {formatStringToTitleCase(props.allegation.paragraph)}
          </Typography>
        </div>
      </div>
      {props.canEdit ? (
        <div style={{ minWidth: "189px", paddingRight: "0px" }}>
          {props.editMode ? null : (
            <div>
              <LinkButton
                data-testid={"editAllegationButton"}
                onClick={props.handleSubmit()}
                style={{ flex: 1 }}
              >
                Edit
              </LinkButton>
              <LinkButton
                data-testid={"removeAllegationButton"}
                onClick={props.handleRemoveAllegation()}
                style={{ flex: 1 }}
              >
                Remove
              </LinkButton>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </AccordionSummary>
  );
};

OfficerAllegationSummary.propTypes = {
  canEdit: PropTypes.bool, // can you edit an allegation from this panel
  editMode: PropTypes.bool, // are you in edit mode rn? Not if canEdit === false
  allegation: PropTypes.shape({
    // details of the allegation
    rule: PropTypes.string,
    paragraph: PropTypes.string
  }).isRequired,
  handleSubmit: PropTypes.func, // function called when clicking edit button (not necessary if canEdit === false)
  handleRemoveAllegation: PropTypes.func // function called when clicking remove button (not necessary if canEdit === false)
};

export default OfficerAllegationSummary;
