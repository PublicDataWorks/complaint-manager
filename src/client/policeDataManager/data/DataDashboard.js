import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Visualization from "../../common/components/Visualization/Visualization";
import MapVisualization from "../../common/components/Visualization/MapVisualization";
import {
  QUERY_TYPES,
  DATE_RANGE_TYPE
} from "../../../sharedUtilities/constants";
import { connect } from "react-redux";

class DataDashboard extends Component {
  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>Data Dashboard</NavBar>
        <main role="main">
          <h1></h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            {this.props.mapVisualizationFeature ? (
              <section style={{ margin: "5px" }}>
                <h2>Map of Complaints</h2>
                <MapVisualization isPublic={false} />
              </section>
            ) : (
              ""
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Visualization
                data-testid={"intakeSourceGraphYTD"}
                queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.YTD }}
                hasDropdown={true}
              />
              <Visualization
                data-testid={"intakeSourceGraphPast12"}
                queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              />
            </div>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Visualization
                data-testid={"complainantTypeGraphYTD"}
                queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.YTD }}
                hasDropdown={true}
              />
              <Visualization
                data-testid={"complainantTypeGraphPast12"}
                queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              />
            </div>
            <br />
            <div>
              <Visualization
                data-testid={"complainantTypePast12MonthsGraph"}
                queryType={
                  // FIXME This query has the date range hard coded!!!
                  QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS
                }
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              />
            </div>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Visualization
                data-testid={"top10TagsGraph"}
                queryType={QUERY_TYPES.COUNT_TOP_10_TAGS}
                queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default connect(state => ({
  mapVisualizationFeature: state.featureToggles.mapVisualizationFeature
}))(DataDashboard);
