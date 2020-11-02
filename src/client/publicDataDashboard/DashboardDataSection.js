import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import Visualization from "../common/components/Visualization/Visualization";
import TextTruncate from "../policeDataManager/shared/components/TextTruncate";
import { DATA_SECTIONS } from "../../sharedUtilities/constants";

class DashboardDataSection extends Component {
  getIdFromDataSectionType(dataSectionType) {
    if (!dataSectionType || typeof dataSectionType !== "string")
      return "cannot-convert-id";
    const [_, rawId] = dataSectionType.split("DDS_") || [];
    return rawId.toLowerCase().replace(/_/g, "-");
  }

  render() {
    const { dataSectionType } = this.props;
    const {
      title,
      subtitle,
      dataTestId,
      queryType,
      queryOptions,
      collapsedText,
      fullMessage
    } = DATA_SECTIONS[dataSectionType] || {};

    return (
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography
            id={this.getIdFromDataSectionType(dataSectionType)}
            variant="h2"
          >
            {title}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="subtitle1">{subtitle}</Typography>
        </Grid>
        <Grid item xs={12} style={{ padding: 0 }}>
          <Visualization
            data-testid={dataTestId}
            isPublic
            queryType={queryType}
            queryOptions={queryOptions}
          />
        </Grid>
        <Grid item xs={8} style={{ paddingBottom: "117px" }}>
          <TextTruncate collapsedText={collapsedText} message={fullMessage} />
        </Grid>
      </Grid>
    );
  }
}

export default DashboardDataSection;
