import React, { useState } from "react";
import styles from "./DataVisSection.module.css";
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
import publicInfoStyles from "../publicInfoStyles";
import alertImg from "./alertImg.svg";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import useMenuControl from "../../../common/hooks/useMenuControl";

const DataVisSection = ({ screenSize }) => {
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
          className={styles.categoryButtonTitle}
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
          marginTop: "50px"
        }}
      >
        <Typography
          className={`${styles.categoryButtonTitle} ${styles.categoryButtonTitleDesktop}`}
        >
          Category
        </Typography>
        <ButtonGroup
          className={styles.categoryButtonGroup}
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="text"
        >
          {dropdownOptions.map(option => (
            <Button
              className={styles.categoryButton}
              sx={{ "&.active": { color: "#22767C" } }}
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
      <Box className={styles.failedToLoadWrapper}>
        <img src={alertImg} />
        <Typography className={styles.failedToLoadText}>
          Unable to load data. Please wait a moment and try again.
        </Typography>
      </Box>
    );
  };

  return (
    <section
      className={
        screenSize === SCREEN_SIZES.DESKTOP
          ? styles.dataSectionWrapperDesktop
          : styles.dataSectionWrapper
      }
    >
      <Typography variant="h2" className={styles.dataSectionTitle}>
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
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          width: "100%"
        }}
      >
        {screenSize === SCREEN_SIZES.DESKTOP
          ? renderCategoryList()
          : renderCategoryDropdown()}

        <Box
          style={{ width: "75%" }}
          className={
            screenSize === SCREEN_SIZES.DESKTOP
              ? styles.graphInfoContainerDesktop
              : styles.graphInfoContainer
          }
        >
          <Typography
            variant="h3"
            className={
              screenSize === SCREEN_SIZES.DESKTOP
                ? styles.graphCategoryTitleDesktop
                : styles.graphCategoryTitle
            }
          >
            {getCategoryTitle(category)}
          </Typography>
          <Typography
            variant="body1"
            className={
              screenSize === SCREEN_SIZES.DESKTOP
                ? styles.graphCategoryDescriptionDesktop
                : styles.graphCategoryDescription
            }
          >
            {getGraphInfo(category)}
          </Typography>

          {/* GRAPH GOES HERE */}
          {/* AND need to change the failedToLoad function to conditionally render */}
          <Box style={{ height: "65%", border: ".5px solid black" }}>
            {failedToLoad()}
          </Box>

          <Typography variant="caption text" className={styles.sourceText}>
            Source: Source: Bureau of Justice Statistics, Federal Justice
            Statistics Program, 2021 (preliminary); US Census, 2022; and
            National Prisoner Statistics, 2021.
          </Typography>
        </Box>
      </div>
    </section>
  );
};

export default withStyles(publicInfoStyles)(DataVisSection);
