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
import CountComplaintsByIntakeSource from "../../common/components/Visualization/models/countComplaintsByIntakeSource.model";
import CountComplaintsByComplainantType from "../../common/components/Visualization/models/countComplaintsByComplainantType.model";
import CountMonthlyComplaintsByComplainantType from "../../common/components/Visualization/models/countMonthlyComplaintsByComplainantType.model";
import CountTop10Tags from "../../common/components/Visualization/models/countTop10Tags.model";
import CountTop10Allegations from "../../common/components/Visualization/models/countTop10Allegations.model";
import CountComplaintsByDistrict from "../../common/components/Visualization/models/countComplaintsByDistrict.model";
import { Checkbox } from "@material-ui/core";

class DataDashboard extends Component {
  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>Data Dashboard</NavBar>
        <main role="main" style={{ overflow: "scroll" }}>
          {this.props.mapVisualizationFeature && (
            <section style={{ margin: "5px" }}>
              <h2>Map of Complaints</h2>
              <MapVisualization isPublic={false} />
            </section>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              flexWrap: "wrap"
            }}
          >
            <Visualization
              data-testid={"intakeSourceGraphYTD"}
              queryModel={new CountComplaintsByIntakeSource()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.YTD
              }}
              hasDropdown={true}
            />
            <Visualization
              data-testid={"intakeSourceGraphPast12"}
              queryModel={new CountComplaintsByIntakeSource()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
              }}
              hasDropdown={true}
            />
            <Visualization
              data-testid={"complainantTypeGraphYTD"}
              queryModel={new CountComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.YTD
              }}
              hasDropdown={true}
            />
            <Visualization
              data-testid={"complainantTypeGraphPast12"}
              queryModel={new CountComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
              }}
              hasDropdown={true}
            />
          </div>
          <div>
            <Visualization
              data-testid={"complainantTypePast12MonthsGraph"}
              queryModel={new CountMonthlyComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
              }}
              hasDropdown={true}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "start"
            }}
          >
            <div style={{ minWidth: "800px", marginRight: "5px" }}>
              <Visualization
                data-testid={"top10TagsGraph"}
                queryModel={new CountTop10Tags()}
                queryOptions={{
                  dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
                }}
                hasDropdown={true}
              />
            </div>
            {this.props.countByDistrictVisualizationFeature && (
              <div style={{ minWidth: "800px", marginLeft: "5px" }}>
                <Visualization
                  data-testid={"countByDistrictGraph"}
                  queryModel={new CountComplaintsByDistrict()}
                  queryOptions={{
                    dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
                  }}
                  hasDropdown={true}
                />
              </div>
            )}
            {this.props.topAllegationsVisualizationFeature && (
              <div style={{ width: "800px", marginLeft: "5px" }}>
                <Visualization
                  queryModel={new CountTop10Allegations()}
                  queryOptions={{
                    dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS
                  }}
                  hasDropdown={true}
                />
              </div>
            )}
          </div>
          <br />
        </main>
      </div>
    );
  }
}

export default connect(state => ({
  mapVisualizationFeature: state.featureToggles.mapVisualizationFeature,
  countByDistrictVisualizationFeature:
    state.featureToggles.countByDistrictVisualizationFeature,
  topAllegationsVisualizationFeature:
    state.featureToggles.topAllegationsVisualizationFeature
}))(DataDashboard);
