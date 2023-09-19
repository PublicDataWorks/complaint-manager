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
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import useMenuControl from "../../../common/hooks/useMenuControl";
import { graphInfo, categories } from "./dataVisData";
import DataVisContainer from "./DataVisContainer";

const DataVisSection = ({ classes, screenSize }) => {
  const [category, setCategory] = useState("Demographics");
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

  const categoryOptions = Object.values(categories);

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
      <Box className={classes.categoryListWrapper}>
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
        className={`${classes.categoryWrapper} ${
          classes[`categoryWrapper-${screenSize}`]
        }`}
      >
        {screenSize === SCREEN_SIZES.DESKTOP
          ? renderCategoryList()
          : renderCategoryDropdown()}

        <DataVisContainer
          screenSize={screenSize}
          category={category}
          graphInfo={graphInfo[category]}
        />
      </div>
    </section>
  );
};

export default withStyles(dataVisStyles)(DataVisSection);
