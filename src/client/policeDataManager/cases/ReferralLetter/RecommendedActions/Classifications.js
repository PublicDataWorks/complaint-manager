import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { reduxForm } from "redux-form";
import FormGroup from "@material-ui/core/FormGroup";
import BoldCheckBoxFormControlLabel from "../../../shared/components/BoldCheckBoxFormControlLabel";
import standards from "../../../../common/globalStyling/standards";
import styles from "../../../../common/globalStyling/styles";
import { DECLINES_OPTION } from "../../../../../sharedUtilities/constants";
import _ from "lodash";

const {
  CLASSIFICATIONS_INFORMATIONAL_TEXT
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterDefaults`);
class Classifications extends Component {
  constructor(props) {
    super(props);
    this.state = { classificationsDisabled: props.initialDisabled };
  }

  uncheckClassificationsIfDeclinesToClassifyIsChecked() {
    (this.props.classifications || []).map(classification => {
      if (classification.name !== DECLINES_OPTION) {
        this.props.change(`csfn-${classification.id}`, false);
      }
    });
  }

  handleChange(event, value, label) {
    if (label === DECLINES_OPTION) {
      this.uncheckClassificationsIfDeclinesToClassifyIsChecked();
      this.setState({
        classificationsDisabled: value
      });
    }
  }

  render() {
    return (
      <Card data-testid="classificationsContainer" style={styles.cardStyling}>
        <CardContent style={styles.cardStyling}>
          <Typography
            style={{
              fontWeight: "bold",
              fontSize: standards.fontSmall
            }}
          >
            CLASSIFICATION
          </Typography>
          <Typography
            style={{ marginBottom: standards.small, fontStyle: "italic" }}
          >
            {CLASSIFICATIONS_INFORMATIONAL_TEXT}
          </Typography>
          <Fragment>
            <FormGroup>
              {this.props.classifications.map(classification => {
                return (
                  <div key={classification.id}>
                    <BoldCheckBoxFormControlLabel
                      name={`csfn-${classification.id}`}
                      key={classification.id}
                      label={classification.name}
                      onChange={this.handleChange.bind(this)}
                      disabled={this.state.classificationsDisabled}
                      dataTest={_.kebabCase(classification.name)}
                    />
                    <Typography style={{ marginLeft: standards.large }}>
                      {classification.message}
                    </Typography>
                  </div>
                );
              })}
            </FormGroup>
          </Fragment>
        </CardContent>
      </Card>
    );
  }
}

export default reduxForm({ form: "RecommendedActions" })(Classifications);
