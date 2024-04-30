import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Visualization from "../../common/components/Visualization/Visualization";
import MapVisualization from "../../common/components/Visualization/MapVisualization";
import {
  DATE_RANGE_TYPE,
  CASE_STATUS
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
  constructor() {
    super();
    this.state = {
      statusForwarded: true,
      statusClosed: true,
      statusActive: true,
      statusInitial: true,
      statusLetterInProgress: true,
      statusReadyForReview: true,
      caseStatusesToFilterBy: [
        CASE_STATUS.FORWARDED_TO_AGENCY,
        CASE_STATUS.CLOSED,
        CASE_STATUS.ACTIVE,
        CASE_STATUS.INITIAL,
        CASE_STATUS.LETTER_IN_PROGRESS,
        CASE_STATUS.READY_FOR_REVIEW
      ]
    };
    this.statusEnum = {
      statusForwarded: CASE_STATUS.FORWARDED_TO_AGENCY,
      statusClosed: CASE_STATUS.CLOSED,
      statusActive: CASE_STATUS.ACTIVE,
      statusInitial: CASE_STATUS.INITIAL,
      statusLetterInProgress: CASE_STATUS.LETTER_IN_PROGRESS,
      statusReadyForReview: CASE_STATUS.READY_FOR_REVIEW
    };
    this.statusFilter = [
      {
      name: "statusForwarded",
      displayName: CASE_STATUS.FORWARDED_TO_AGENCY
      },
      {
        name: "statusClosed",
        displayName: CASE_STATUS.CLOSED
      },
      {
        name: "statusActive",
        displayName: CASE_STATUS.ACTIVE
      },
      {
        name: "statusInitial",
        displayName: CASE_STATUS.INITIAL
      },
      {
        name: "statusLetterInProgress",
        displayName: CASE_STATUS.LETTER_IN_PROGRESS
      },
      {
        name: "statusReadyForReview",
        displayName: CASE_STATUS.READY_FOR_REVIEW
      }
      ]
  }

  handleCheckboxChange = event => {
    const caseStatus = this.statusEnum[event.target.name];
    const statusToFilter = event.target.checked
      ? [...this.state.caseStatusesToFilterBy, caseStatus]
      : this.state.caseStatusesToFilterBy.filter(s => s !== caseStatus);
    this.setState({
      [event.target.name]: event.target.checked,
      caseStatusesToFilterBy: statusToFilter
    });
  };
  
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
          <div>
            {this.statusFilter.map(status => {
              return (
               <> 
              <Checkbox
                key={status.name}
                data-testid={"checkbox"} 
                checked={this.state[status.name]}
                onChange={event => {
                  this.handleCheckboxChange(event);
                }}
                color="default"
                style={{ color: "#000000" }}
                name={status.name}
            />
            {status.displayName}
            </>
          )
          })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start"
            }}
          >
            <Visualization
              data-testid={"intakeSourceGraphYTD"}
              queryModel={new CountComplaintsByIntakeSource()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.YTD,
                filterByCaseStatus: this.state.caseStatusesToFilterBy
              }}
              hasDropdown={true}
            />
            <Visualization
              data-testid={"intakeSourceGraphPast12"}
              queryModel={new CountComplaintsByIntakeSource()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                filterByCaseStatus: this.state.caseStatusesToFilterBy
              }}
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
              queryModel={new CountComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.YTD,
                filterByCaseStatus: this.state.caseStatusesToFilterBy
              }}
              hasDropdown={true}
            />
            <Visualization
              data-testid={"complainantTypeGraphPast12"}
              queryModel={new CountComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                filterByCaseStatus: this.state.caseStatusesToFilterBy
              }}
              hasDropdown={true}
            />
          </div>
          <div>
            <Visualization
              data-testid={"complainantTypePast12MonthsGraph"}
              queryModel={new CountMonthlyComplaintsByComplainantType()}
              queryOptions={{
                dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                filterByCaseStatus: this.state.caseStatusesToFilterBy
              }}
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
            <div style={{ minWidth: "800px", marginRight: "5px" }}>
              <Visualization
                data-testid={"top10TagsGraph"}
                queryModel={new CountTop10Tags()}
                queryOptions={{
                  dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                  filterByCaseStatus: this.state.caseStatusesToFilterBy
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
                    dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                    filterByCaseStatus: this.state.caseStatusesToFilterBy
                  }}
                  hasDropdown={true}
                />
              </div>
            )}
          </div>
          <div>
            {this.props.topAllegationsVisualizationFeature && (
              <div style={{ width: "800px", marginLeft: "5px" }}>
                <Visualization
                  queryModel={new CountTop10Allegations()}
                  queryOptions={{
                    dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS,
                    filterByCaseStatus: this.state.caseStatusesToFilterBy
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
