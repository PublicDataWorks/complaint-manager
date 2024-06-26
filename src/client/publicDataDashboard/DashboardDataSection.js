import React, { lazy, Suspense } from "react";
import Grid from "@material-ui/core/Grid";
import MUILink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
const Visualization = lazy(() =>
  import("../common/components/Visualization/Visualization")
);
const MapVisualization = lazy(() =>
  import("../common/components/Visualization/MapVisualization")
);
import TextTruncate from "../policeDataManager/shared/components/TextTruncate";
import useTheme from "@material-ui/core/styles/useTheme";
import { getQueryModelByQueryType } from "../common/components/Visualization/models/queryModelFactory";
import { getIdFromDataSectionType } from "./dataDashboardHelper";

const DashboardDataSection = props => {
  const theme = useTheme();

  const { dataSectionType } = props;
  const { title, subtitle, queryType, collapsedText, fullMessage } =
    dataSectionType || {};

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
      <Suspense fallback={<div></div>}>
        {queryType === "LOCATION_DATA" ? (
          <MapVisualization isPublic={true} />
        ) : (
          <Grid
            item
            xs={12}
            style={{
              padding: 0,

              maxWidth: "810px",
              overflowX: "scroll",
              overflowY: "hidden"
            }}
          >
            <Visualization
              isPublic
              queryModel={getQueryModelByQueryType(queryType)}
              hasDropdown={true}
            />
          </Grid>
        )}
      </Suspense>
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
