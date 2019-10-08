import { Card, CardContent, FormControlLabel } from "@material-ui/core";
import React, { Fragment, Component } from "react";
import { Field, reduxForm } from "redux-form";
import FormGroup from "@material-ui/core/FormGroup";
import PrimaryCheckBox from "../../../shared/components/PrimaryCheckBox";
import { connect } from "react-redux";
import getClassificationOptions from "../thunks/getClassificationOptions";

class Classifications extends Component {
  componentDidMount() {
    this.props.getClassificationOptions();
  }

  render() {
    return (
      <Card data-test="classificationsContainer">
        <CardContent>
          <Fragment>
            <FormGroup>
              <FormControlLabel
                key={"Dayum"}
                label="Happy days"
                control={
                  <Field
                    name={"Bob"}
                    component={PrimaryCheckBox}
                    data-test={"Use of Force"}
                  />
                }
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: "RecommendedActions" })(Classifications)
);
