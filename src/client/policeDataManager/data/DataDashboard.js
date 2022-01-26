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
              justifyContent: "start"
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
              hasDropdown={true}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start"
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
              hasDropdown={true}
            />
          </div>
          <div>
            <Visualization
              data-testid={"complainantTypePast12MonthsGraph"}
              queryType={
                QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE
              }
              queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              hasDropdown={true}
            />
          </div>
          <div style={{ maxWidth: "1000px" }}>
            <Visualization
              data-testid={"top10TagsGraph"}
              queryType={QUERY_TYPES.COUNT_TOP_10_TAGS}
              queryOptions={{ dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS }}
              hasDropdown={true}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default connect(state => ({
  mapVisualizationFeature: state.featureToggles.mapVisualizationFeature
}))(DataDashboard);
