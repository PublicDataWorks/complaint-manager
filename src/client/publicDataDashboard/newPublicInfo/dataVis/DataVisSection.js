import React, { useState } from "react";
import {
  Button,
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
    if (selection === "Facility Capacity") {
      return "Facility Overcrowding Rates";
    } else if (selection === "Demographics") {
      return "Demographic Breakdown";
    } else {
      return "";
    }
  };

  const getGraphInfo = selection => {
    if (selection === "Facility Capacity") {
      return "Hawaii’s jail facilities are chronically overcrowded.";
    } else if (selection === "Demographics") {
      return "Hawaiian and Black communities are disproportionally impacted by incarceration";
    } else {
      return "";
    }
  };

  const failedToLoad = () => {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img src={alertImg} />
        <Typography
          style={{
            textAlign: "center",
            fontFamily: "inherit",
            paddingTop: "16px"
          }}
        >
          Unable to load data. Please wait a moment and try again.
        </Typography>
      </div>
    );
  };

  return (
    <section style={{ margin: "1.5em", height: "95vh", fontFamily: "inherit" }}>
      <Typography
        variant="h2"
        style={{
          fontFamily: "inherit",
          fontSize: "1.5em"
        }}
      >
        Hawaii Prison Profile Dashboard
      </Typography>
      <hr
        style={{
          margin: "18px 0 18px -24px",
          width: "100vw"
        }}
      />
      <div style={{ width: "211px" }}>
        <Button
          variant="contained"
          style={{
            width: "211px",
            fontFamily: "inherit",
            fontWeight: "500",
            fontSize: "20px",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            textTransform: "none",
            borderRadius: "0",
            backgroundColor: "#ECF1F4",
            borderColor: "#ECF1F4",
            boxShadow: "none"
          }}
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
      </div>
      <div
        style={{
          fontFamily: "Montserrat",
          height: "80%",
          marginTop: "28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Typography
          variant="h3"
          style={{
            fontFamily: "inherit",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "24px"
          }}
        >
          {getCategoryTitle(category)}
        </Typography>
        <Typography
          style={{
            fontFamily: "inherit",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "16px",
            padding: "16px 0"
          }}
        >
          {getGraphInfo(category)}
        </Typography>
        <div style={{ height: "65%", border: ".5px solid black" }}>
          {failedToLoad()}
        </div>
        <Typography
          style={{
            fontFamily: "inherit",
            fontWeight: "500",
            fontSize: "14px",
            paddingTop: "16px"
          }}
        >
          Source: Source: Bureau of Justice Statistics, Federal Justice
          Statistics Program, 2021 (preliminary); US Census, 2022; and National
          Prisoner Statistics, 2021.
        </Typography>
      </div>
    </section>
  );
};

export default withStyles(publicInfoStyles)(DataVisSection);
