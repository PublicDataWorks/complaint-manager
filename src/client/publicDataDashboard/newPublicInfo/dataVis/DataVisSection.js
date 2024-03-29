import React, { useState } from "react";
import dataVisStyles from "./dataVisStyles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import useMenuControl from "../../../common/hooks/useMenuControl";
import { graphInfo, categories } from "./dataVisData";
import DataVisContainer from "./DataVisContainer";

const DataVisSection = ({ classes, screenSize }) => {
  const [category, setCategory] = useState("Facility Overcrowding Rates");
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();

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
          {categories.map(option => (
            <MenuItem
              key={option}
              value={option}
              style={{
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
          {categories.map(option => (
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
        className={`${
          screenSize === SCREEN_SIZES.MOBILE
            ? classes.mobileHorizontalLine
            : classes.desktopHorizontalLine
        }`}
      />
      <Typography variant="h3" className={classes.dataSectionSubtitle}>
        Without knowing where we are, we cannot focus on what needs to be
        changed. Click through the below data categories to learn more about who
        is in our system and why.
      </Typography>
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
