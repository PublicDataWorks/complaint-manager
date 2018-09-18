import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";

class JobDetails extends Component {
  componentDidMount() {}

  render() {
    return <p> Job location {this.props.job.result.Location} </p>;
  }
}

export default connect()(JobDetails);
