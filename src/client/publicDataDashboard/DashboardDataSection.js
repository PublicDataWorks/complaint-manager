import React from "react";
import { Grid, Typography } from "@material-ui/core";
import Visualization from "../common/components/Visualization/Visualization";
import TextTruncate from "../policeDataManager/shared/components/TextTruncate";
import { DATA_SECTIONS } from "../../sharedUtilities/constants";
import useTheme from "@material-ui/core/styles/useTheme";

const getIdFromDataSectionType = dataSectionType => {
  if (!dataSectionType || typeof dataSectionType !== "string")
    return "cannot-convert-id";
  const [_, rawId] = dataSectionType.split("DDS_") || [];
  return rawId.toLowerCase().replace(/_/g, "-");
};

const DashboardDataSection = props => {
  const theme = useTheme();

  const { dataSectionType } = props;
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
    <Grid
      container
      spacing={3}
      id={getIdFromDataSectionType(dataSectionType)}
      style={{
        padding: theme.dashboard.dataSection.padding,
        paddingTop: "18px"
      }}
    >
      <Grid item xs={12} sm={8}>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
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
      <Grid item xs={12} sm={8} style={{ paddingBottom: "117px" }}>
        <TextTruncate collapsedText={collapsedText} message={fullMessage} />
      </Grid>
    </Grid>
  );
};

export default DashboardDataSection;
