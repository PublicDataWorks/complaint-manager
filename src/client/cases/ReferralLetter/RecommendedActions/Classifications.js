import {
  Card,
  CardContent,
  FormControlLabel,
  Typography
} from "@material-ui/core";
import React, { Fragment, Component } from "react";
import { Field, reduxForm } from "redux-form";
import FormGroup from "@material-ui/core/FormGroup";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";
import { connect } from "react-redux";
import getClassificationOptions from "../thunks/getClassificationOptions";
import BoldCheckBoxFormControlLabel from "../../../shared/components/BoldCheckBoxFormControlLabel";
import styles from "../../../globalStyling/styles";

class Classifications extends Component {
  componentDidMount() {
    this.props.getClassificationOptions();
  }

  render() {
    return (
      <Card data-test="classificationsContainer" style={styles.cardStyling}>
        <CardContent style={styles.cardStyling}>
          <Typography style={{ marginBottom: "24px", fontWeight: "bold" }}>
            Classifications
          </Typography>
          <Fragment>
            <FormGroup>
              {this.props.classifications.map(classification => {

                return (
                  <div>
                    <BoldCheckBoxFormControlLabel
                      name={classification.name}
                      key={classification.name}
                      labelText={classification.name}
                    />
                    <Typography style={{ marginLeft: styles.medium}}>
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
