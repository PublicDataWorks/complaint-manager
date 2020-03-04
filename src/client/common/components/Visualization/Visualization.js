import React from "react";
import axios from "axios";
import * as countComplaintsByIntakeSource from "./Transformers/countComplaintsByIntakeSource";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { PlotlyWrapper } from "./PlotlyWrapper";

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isFetching: false
    };
  }

  async componentDidMount() {
    this.setState({ ...this.state, isFetching: true });
    await axios
      .get(`/api/data?queryType=${this.props.queryType}`)
      .then(response => {
        let transformedData;
        switch (this.props.queryType) {
          case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
            transformedData = countComplaintsByIntakeSource.transformData(
              response.data
            );
            break;
          default:
            throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
        }
        this.setState({ isFetching: false, data: transformedData });
      })
      .catch(error => {
        this.setState({ ...this.state, isFetching: false });
      })
  }

  render() {
    return (
        <PlotlyWrapper
          data={[this.state.data]}
          layout={{
            width: 500,
            height: 500,
            title: "Complaints by Intake Source",
            margin: 20
          }}
        />
    );
  }
}

export default Visualization;
