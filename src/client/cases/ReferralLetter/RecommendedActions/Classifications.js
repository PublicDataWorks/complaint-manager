import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import { reduxForm } from "redux-form";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import getClassificationOptions from "../thunks/getClassificationOptions";
import BoldCheckBoxFormControlLabel from "../../../shared/components/BoldCheckBoxFormControlLabel";
import styles from "../../../globalStyling/styles";

class Classifications extends Component {
  componentDidMount() {
    this.props.getClassificationOptions();
  }

  handleChange(name, isMarked) {
    if (name === "Disabled") {
      this.setState({
        disableOptions: isMarked
      });
    }
  }

  render() {
    return (
      <Card data-test="classificationsContainer" style={styles.cardStyling}>
        <CardContent style={styles.cardStyling}>
          <Typography
            style={{ marginBottom: styles.medium, fontWeight: "bold" }}
          >
            CLASSIFICATION
          </Typography>
          <Fragment>
            <FormGroup>
              {this.props.classifications.map(classification => {
                return (
                  <div>
                    <BoldCheckBoxFormControlLabel
                      name={`csfn-${classification.id}`}
                      key={classification.name}
                      labelText={classification.name}
                      onChange={this.handleChange}
                    />
                    <Typography style={{ marginLeft: styles.large }}>
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
