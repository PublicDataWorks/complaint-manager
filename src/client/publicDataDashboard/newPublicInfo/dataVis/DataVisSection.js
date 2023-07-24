import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  withStyles
} from "@material-ui/core";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const DataVisSection = ({ classes, screenSize }) => {
  const [category, setCategory] = useState("");

  console.log("anchorEl: ", anchorEl);

  const dropdownOptions = [
    screenSize === SCREEN_SIZES.DESKTOP
      ? "Facility Capacity Rates"
      : "Facility Capacity",
    "Demographics"
  ];

  return (
    <section style={{ margin: "1.5em", height: "90vh", fontFamily: "inherit" }}>
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
      <FormControl
        variant="filled"
        sx={{ m: 1, minWidth: 160 }}
        style={{ width: "65%" }}
        size="small"
      >
        <InputLabel
          id="demo-simple-select-filled-label"
          style={{ color: "black", fontFamily: "inherit" }}
        >
          Category
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={category}
          onChange={e => setCategory(e.target.value)}
          label="Category"
          style={{ fontFamily: "inherit" }}
        >
          {dropdownOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </section>
  );
};

export default withStyles(publicInfoStyles)(DataVisSection);
