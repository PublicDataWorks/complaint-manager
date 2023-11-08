import React from "react";
import { withStyles } from "@material-ui/styles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import Typography from "@material-ui/core/Typography";
import staffingShortageStyles from "./staffingShortageStyles";
import { colors } from "../publicInfoStyles";
import HawaiiJailsPrisonMap4 from "../../../../assets/Hawaii-Jails-Prison-map4.png";

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
          Serious overcrowding attributes to inhumane conditions, specifically
          for jails.
        </Typography>
        <Typography
          className={`${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          }`}
          style={{ backgroundColor: colors.secondaryBrand }}
        >
          <span className={classes.statisticSpan}>65%</span>
          Nearly 65% of people in custody are in secure cell settings.
        </Typography>
        {screenSize === SCREEN_SIZES.DESKTOP ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#c8ddde",
              gridArea: "1 / 2 / 3 / 4"
            }}
          >
            <img
              className={`${classes[`hawaiiMapImg-${screenSize}`]} ${
                classes[`image-${screenSize}`]
              }`}
              src={HawaiiJailsPrisonMap4}
              alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
            />
          </div>
        ) : (
          <img
            className={`${classes[`hawaiiMapImg-${screenSize}`]} ${
              classes[`image-${screenSize}`]
            }`}
            src={HawaiiJailsPrisonMap4}
            alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
          />
        )}
        <Typography
          className={`${classes[`statOverlay-${screenSize}`]} ${
            classes[`image-${screenSize}`]
          } ${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          }`}
          style={{ backgroundColor: colors.secondaryBrand, zIndex: "1" }}
        >
          <span className={classes.statisticSpan}>64%</span>
          Average Capacity in State Prisons
        </Typography>
        <Typography
          className={`${classes.gridCard} ${classes.statisticCard} ${
            classes[`statisticCard-${screenSize}`]
          } ${classes[`statisticCardForest-${screenSize}`]}`}
        >
          <span className={classes.statisticSpan}>140%</span>
          Average Capacity in State Jails
        </Typography>
        <Typography className={`${classes.gridCard} ${classes.staffingCard}`}>
          Average rate across the country is 40-50% for those in secure cell
          settings. Secure settings create serious lack of movement and
          out-of-cell time for those in custody.
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
