import React from "react";
import { withStyles } from "@material-ui/styles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { Typography } from "@material-ui/core";
import staffingShortageStyles from "./staffingShortageStyles";
import { colors } from "../publicInfoStyles";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const StaffingShortage = ({ screenSize, classes }) => {
  return (
    <section
      id="staffing-shortage"
      className={`${classes.staffingShortageContainer} ${
        classes[`staffingShortageContainer-${screenSize}`]
      }`}
    >
      <Typography
        variant="h2"
        className={`${classes.h2} ${classes.staffingShortageSubHeader}`}
      >
        Overall Impression
      </Typography>
      <Typography variant="h2" className={classes.h2} style={{ margin: "0px" }}>
        Staffing Shortage
      </Typography>
      <div className={`${classes[`staffingShortageGrid-${screenSize}`]}`}>
        <Typography className={`${classes.gridCard} ${classes.staffingCard}`}>
          Serious overcrowding attributing to inhumane conditions, specifically
          for jails.
        </Typography>
        <Typography
          className={`${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          }`}
        >
          <span className={classes.statisticSpan}>93%</span>
          Capacity in Prisons
        </Typography>
        {screenSize === SCREEN_SIZES.DESKTOP ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgb(145,180,242)",
              gridArea: "1 / 2 / 3 / 4"
            }}
          >
            <img
              className={`${classes[`hawaiiMapImg-${screenSize}`]} ${
                classes[`image-${screenSize}`]
              }`}
              src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
              alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
            />
          </div>
        ) : (
          <img
            className={`${classes[`hawaiiMapImg-${screenSize}`]} ${
              classes[`image-${screenSize}`]
            }`}
            src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
            alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
          />
        )}
        <Typography
          className={`${classes[`imgOverHawaiiMap-${screenSize}`]} ${
            classes[`image-${screenSize}`]
          } ${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          }`}
          style={{ backgroundColor: colors.secondaryBrand }}
        >
          <span className={classes.statisticSpan}>156%</span>
          Capacity in Jails
        </Typography>
        <Typography
          className={`${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          } ${classes[`statisticCardForest-${screenSize}`]}`}
        >
          <span className={classes.statisticSpan}>80%</span>
          Nearly 80% of People in Custody Are in Secure Settings
        </Typography>
        <Typography className={`${classes.gridCard} ${classes.staffingCard}`}>
          Average rate across the country is 40-50%. Serious lack of movement
          and out-of-cell time for those in custody.
        </Typography>
        <img
          className={`${classes[`inPrisonImg-${screenSize}`]} ${
            classes[`image-${screenSize}`]
          }`}
          src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
          alt="Two men in orange jumpsuits and white sneakers sitting on a bench behind bars facing each other"
        />
      </div>
    </section>
  );
};

export default withStyles(staffingShortageStyles)(StaffingShortage);
