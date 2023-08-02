import React, { useState } from "react";
import dataVisStyles from "./dataVisStyles";
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import alertImg from "./alertImg.svg";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import useMenuControl from "../../../common/hooks/useMenuControl";

const DataVisSection = ({ classes, screenSize }) => {
  const [category, setCategory] = useState("Demographics");
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const dropdownOptions = [
    screenSize === SCREEN_SIZES.DESKTOP
      ? "Facility Capacity Rates"
      : "Facility Capacity",
    "Demographics"
  ];

  const getCategoryTitle = selection => {
    if (
      selection === "Facility Capacity" ||
      selection === "Facility Capacity Rates"
    ) {
      return "Facility Overcrowding Rates";
    } else if (selection === "Demographics") {
      return "Demographic Breakdown";
    } else {
      return "";
    }
  };

  const getGraphInfo = selection => {
    if (screenSize === SCREEN_SIZES.MOBILE) {
      if (selection === "Facility Capacity") {
        return "Hawaii’s jail facilities are chronically overcrowded.";
      } else if (selection === "Demographics") {
        return "Hawaiian and Black communities are disproportionally impacted by incarceration.";
      } else {
        return "";
      }
    } else if (screenSize === SCREEN_SIZES.TABLET) {
      return "Native Hawaiian and Pacific Islanders are over incarcerated. This group makes up 23% of the population but makes up 47% of people in custody. Black communities are also disproportionally impacted by incarceration at 3% of the population this group is 5% of those incarcerated.";
    } else if (screenSize === SCREEN_SIZES.DESKTOP) {
      if (selection === "Facility Capacity Rates") {
        return "Hawaii’s jail facilities are chronically overcrowded. So much so that 900 people in custody are serving their sentences in a private prison in Arizona.";
      } else if (selection === "Demographics") {
        return "Native Hawaiian and Pacific Islanders are over incarcerated. This group makes up 23% of the population but makes up 47% of people in custody. Black communities are also disproportionally impacted by incarceration at 3% of the population this group is 5% of those incarcerated.";
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const renderCategoryDropdown = () => {
    return (
      <Box style={{ width: "211px" }}>
        <Button
          variant="contained"
          className={classes.categoryButtonTitle}
          data-testid={"generate-letter-button"}
          onClick={handleMenuOpen}
        >
          Category
          <ExpandMoreIcon />
        </Button>
        <Menu
          style={{ fontFamily: "Montserrat" }}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom" }}
          getContentAnchorEl={null}
        >
          {dropdownOptions.map(option => (
            <MenuItem
              key={option}
              value={option}
              style={{
                width: "211px",
                fontFamily: "inherit"
              }}
              onClick={() => (setCategory(option), handleMenuClose())}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  };

  const renderCategoryList = () => {
    return (
      <Box
        style={{
          width: "20%",
          height: "fit-content",
          margin: "50px 5% 0 0"
        }}
      >
        <Typography
          className={`${classes.categoryButtonTitle} ${
            classes[`categoryButtonTitle-${screenSize}`]
          }`}
        >
          Category
        </Typography>
        <ButtonGroup
          className={classes.categoryButtonGroup}
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="text"
        >
          {dropdownOptions.map(option => (
            <Button
              className={`${classes.categoryButton} ${
                option === category ? classes.active : ""
              }`}
              onClick={() => setCategory(option)}
            >
              {option}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    );
  };

  const failedToLoad = () => {
    return (
      <Box className={classes.failedToLoadWrapper}>
        <img src={alertImg} />
        <Typography className={classes.failedToLoadText}>
          Unable to load data. Please wait a moment and try again.
        </Typography>
      </Box>
    );
  };

  return (
    <section
      className={`${classes.dataSectionWrapper} ${
        classes[`dataSectionWrapper-${screenSize}`]
      }`}
    >
      <Typography variant="h2" className={classes.dataSectionTitle}>
        Hawaii Prison Profile Dashboard
      </Typography>
      <hr
        style={{
          margin:
            screenSize === SCREEN_SIZES.MOBILE ? "18px 0 18px -24px" : "18px 0",
          width: screenSize === SCREEN_SIZES.MOBILE ? "100vw" : "100%"
        }}
      />
      <div
        className={`${classes.categoryGraphWrapper} ${
          classes[`categoryGraphWrapper-${screenSize}`]
        }`}
      >
        {screenSize === SCREEN_SIZES.DESKTOP
          ? renderCategoryList()
          : renderCategoryDropdown()}

        <Box
          className={`${classes.graphInfoContainer} ${
            classes[`graphInfoContainer-${screenSize}`]
          }`}
        >
          <Typography
            variant="h3"
            className={`${classes.graphCategoryTitle} ${
              classes[`graphCategoryTitle-${screenSize}`]
            }`}
          >
            {getCategoryTitle(category)}
          </Typography>
          <Typography
            variant="body1"
            className={`${classes.graphCategoryDescription} ${
              classes[`graphCategoryDescription-${screenSize}`]
            }`}
          >
            {getGraphInfo(category)}
          </Typography>

          {/* GRAPH GOES HERE */}
          {/* AND need to change the failedToLoad function to conditionally render */}
          <Box
            className={`${classes.graphWrapper} ${
              classes[`graphWrapper-${screenSize}`]
            }`}
          >
            {failedToLoad()}
          </Box>

          <Typography variant="caption text" className={classes.sourceText}>
            Source: Source: Bureau of Justice Statistics, Federal Justice
            Statistics Program, 2021 (preliminary); US Census, 2022; and
            National Prisoner Statistics, 2021.
          </Typography>
        </Box>
      </div>
    </section>
  );
};

export default withStyles(dataVisStyles)(DataVisSection);
