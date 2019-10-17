import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { reduxForm } from "redux-form";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import getClassificationOptions from "../thunks/getClassificationOptions";
import BoldCheckBoxFormControlLabel from "../../../shared/components/BoldCheckBoxFormControlLabel";
import standards from "../../../globalStyling/standards";
import styles from "../../../globalStyling/styles";
import { DECLINES_OPTION } from "../../../../sharedUtilities/constants";
import _ from "lodash";

class Classifications extends Component {
  constructor(props) {
    super(props);
    this.state = { classificationsDisabled: props.initialDisabled };
  }

  componentDidMount() {
    this.props.getClassificationOptions();
  }

  uncheckClassificationsIfDeclinesToClassifyIsChecked() {
    this.props.classifications.map(classification => {
      if (classification.name !== DECLINES_OPTION) {
        this.props.change(`csfn-${classification.id}`, false);
      }
    });
  }

  handleChange(event, label) {
    if (label === DECLINES_OPTION) {
      this.uncheckClassificationsIfDeclinesToClassifyIsChecked();
      this.setState({
        classificationsDisabled: event
      });
    }
  }

  render() {
    return (
      <Card data-test="classificationsContainer" style={styles.cardStyling}>
        <CardContent style={styles.cardStyling}>
          <Typography
            style={{
              marginBottom: standards.medium,
              fontWeight: "bold",
              fontSize: standards.fontSmall
            }}
          >
            CLASSIFICATION
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

const mapStateToProps = state => ({
  classifications: state.classifications
});

const mapDispatchToProps = {
  getClassificationOptions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: "RecommendedActions" })(Classifications));
