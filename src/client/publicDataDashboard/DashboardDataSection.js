import React from "react";
import { Grid, Link as MUILink, Typography } from "@material-ui/core";
import Visualization from "../common/components/Visualization/Visualization";
import MapVisualization from "../common/components/Visualization/MapVisualization";
import TextTruncate from "../policeDataManager/shared/components/TextTruncate";
import { DATA_SECTIONS } from "../../sharedUtilities/constants";
import useTheme from "@material-ui/core/styles/useTheme";

const getIdFromDataSectionType = dataSectionType => {
  if (!dataSectionType || typeof dataSectionType !== "string")
    return "cannot-convert-id";
  const [_, rawId = ""] = dataSectionType.split("DDS_") || [];
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

  const getTextWithLink = text => {
    let linkSection = text.match(/#(.*.linkTo.*)#/).pop();
    let index = linkSection.indexOf("linkTo");
    let length = "linkTo".length;

    let linkText = linkSection.substring(0, index);
    let linkPath = linkSection.substring(index + length);

    const textArray = text.split("#");
    return (
      <Typography
        variant="body1"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        data-testid={"dataSectionText"}
      >
        {textArray.map((text, index) => {
          return text.includes("linkTo") ? (
            <MUILink key={index} href={linkPath}>
              {linkText}
            </MUILink>
          ) : (
            <span key={index}>{text}</span>
          );
        })}
      </Typography>
    );
  };

  const getDataSectionText = text => {
    return text.includes("linkTo") ? (
      getTextWithLink(text)
    ) : (
      <Typography
        variant="body1"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        data-testid={"dataSectionText"}
      >
        {text}
      </Typography>
    );
  };

  return (
    <Grid
      container
      spacing={3}
      id={getIdFromDataSectionType(dataSectionType)}
      style={{
        padding: theme.dashboard.dataSection.padding,
        paddingTop: "18px",
        display: "block"
      }}
    >
      <Grid item xs={12} sm={8}>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Grid>
      {dataSectionType.includes("LOCATION_DATA") ? (
        <MapVisualization isPublic={true} />
      ) : (
        <Grid
          item
          xs={12}
          style={{
            padding: 0,
            height: "550px",
            maxWidth: "810px",
            overflowX: "scroll",
            overflowY: "hidden"
          }}
        >
          <Visualization
            data-testid={dataTestId}
            isPublic
            queryType={queryType}
            queryOptions={queryOptions}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={8} style={{ paddingBottom: "117px" }}>
        <TextTruncate
          collapsedText={collapsedText}
          message={fullMessage}
          getDataSectionText={getDataSectionText}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardDataSection;
