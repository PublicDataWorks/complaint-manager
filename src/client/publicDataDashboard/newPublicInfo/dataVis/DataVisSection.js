import React, { Fragment, useState } from "react";
import dataVisStyles from "./dataVisStyles";
import "./RadialChart";
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
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import useMenuControl from "../../../common/hooks/useMenuControl";
import { graphInfo, demographicData } from "./dataVisData";
import RadialChart from "./RadialChart";

const categories = {
  demographics: "Demographics",
  facilityCapacity: "Facility Capacity",
  facilityCapacityRates: "Facility Capacity Rates"
};

const DataVisSection = ({ classes, screenSize }) => {
  const [category, setCategory] = useState(categories.demographics);
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const categoryOptions = [
    screenSize === SCREEN_SIZES.DESKTOP
      ? categories.facilityCapacityRates
      : categories.facilityCapacity,
    categories.demographics
  ];

  const getCategoryInfo = selection => {
    if (
      selection === categories.facilityCapacity ||
      selection === categories.facilityCapacityRates
    ) {
      return {
        title: graphInfo.facilityOvercrowding[`${screenSize}`].title,
        description: graphInfo.facilityOvercrowding[`${screenSize}`].description
      };
    } else if (selection === categories.demographics) {
      return {
        title: graphInfo.demographicBreakdown[`${screenSize}`].title,
        description: graphInfo.demographicBreakdown[`${screenSize}`].description
      };
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
          data-testid={"category-dropdown-button"}
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
          {categoryOptions.map(option => (
            <MenuItem
              key={option}
              value={option}
              style={{
                width: "211px",
                fontFamily: "inherit"
              }}
              data-testid={`${option}-selection`}
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
          {categoryOptions.map(option => (
            <Button
              data-testid={`${option}-selection`}
              key={option}
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

  return (
    <section
      id="hawaii-prison-profile-dashboard"
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
            {getCategoryInfo(category).title}
          </Typography>
          <Typography
            variant="body1"
            className={`${classes.graphCategoryDescription} ${
              classes[`graphCategoryDescription-${screenSize}`]
            }`}
          >
            {getCategoryInfo(category).description}
          </Typography>

          <Box
            className={`${classes.graphWrapper} ${
              classes[`graphWrapper-${screenSize}`]
            }`}
          >
            {category === categories.demographics ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    height: "fit-content",
                    marginTop: "20px"
                  }}
                >
                  {demographicData.map(demographic => (
                    <div
                      className={`${classes.radialChartWrapper} ${
                        classes[`radialChartWrapper-${screenSize}`]
                      }`}
                    >
                      <RadialChart
                        title={demographic.title}
                        innerPercentage={demographic.statePopulation}
                        outerPercentage={demographic.incarceratedPopulation}
                        dimension={200}
                        radius={80}
                        strokeWidth={20}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ol className="unordered-list">
                    <li>
                      <span style={{ fontSize: "large", marginRight: "50px" }}>
                        State Population
                      </span>
                    </li>
                    <li>
                      <span style={{ fontSize: "large" }}>
                        Incarcerated Population
                      </span>
                    </li>
                  </ol>
                </div>
              </>
            ) : (
              ""
            )}
          </Box>
          <Typography variant="body1" className={classes.sourceText}>
            Source: Bureau of Justice Statistics, Federal Justice Statistics
            Program, 2021 (preliminary); US Census, 2022; and National Prisoner
            Statistics, 2021.
          </Typography>
        </Box>
      </div>
    </section>
  );
};

export default withStyles(dataVisStyles)(DataVisSection);
