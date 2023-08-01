import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { Typography } from "@material-ui/core";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const cardStyles = {
  statisticSpan: { fontSize: "3.5em", fontWeight: "700" },
  imageMobile: { width: "100%", height: "100%" },
  imageTablet: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  staffingCard: {
    fontFamily: "inherit",
    fontSize: "1em",
    paddingRight: "8%",
    paddingLeft: "8%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  statisticCard: {
    fontFamily: "inherit",
    fontSize: ".9em",
    padding: "2em",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
};

const StaffingShortage = ({ screenSize, classes }) => {
  if (screenSize === SCREEN_SIZES.MOBILE) {
    return (
      <section
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
        <Typography
          variant="h2"
          className={classes.h2}
          style={{ margin: "0px" }}
        >
          Staffing Shortage
        </Typography>

        <div className={classes[`staffingShortageGrid-${screenSize}`]}>
          <Typography
            style={cardStyles.staffingCard}
            className={classes.greyBackground}
          >
            Serious overcrowding attributing to inhumane conditions,
            specifically for jails.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.navyBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>93%</span>
            Capacity in Prisons
          </Typography>
          <img
            style={cardStyles.imageMobile}
            alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
            src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
          />
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.forestBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>156%</span>
            Capacity in Jails
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.navyBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>80%</span>
            Nearly 80% of People in Custody Are in Secure Settings
          </Typography>
          <Typography
            style={cardStyles.staffingCard}
            className={`${classes.greyBackground}`}
          >
            Average rate across the country is 40-50%. Serious lack of movement
            and out-of-cell time for those in custody.
          </Typography>
          <img
            style={cardStyles.imageMobile}
            src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
            alt="Limits out-of-cell time for people in custody (in unit and outdoor recreation). Serious overcrowding attributing to inhumane conditions, specifically for jails"
          />
        </div>
      </section>
    );
  } else if (screenSize === SCREEN_SIZES.TABLET) {
    return (
      <section
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
        <Typography
          variant="h2"
          className={classes.h2}
          style={{ margin: "0px" }}
        >
          Staffing Shortage
        </Typography>

        <div className={classes[`staffingShortageGrid-${screenSize}`]}>
          <Typography
            style={cardStyles.staffingCard}
            className={classes.greyBackground}
          >
            Serious overcrowding attributing to inhumane conditions,
            specifically for jails.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.navyBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>93%</span>
            Capacity in Prisons
          </Typography>
          <img
            style={cardStyles.imageTablet}
            className={classes.hawaiiMapImg}
            alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
            src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
          />

          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.forestBackground} ${classes.lightFontColor} ${classes.imgOverHawaiiMap}`}
          >
            <span style={cardStyles.statisticSpan}>156%</span>
            Capacity in Jails
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.forestBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>80%</span>
            Nearly 80% of People in Custody Are in Secure Settings
          </Typography>
          <Typography
            style={cardStyles.staffingCard}
            className={classes.greyBackground}
          >
            Average rate across the country is 40-50%. Serious lack of movement
            and out-of-cell time for those in custody.
          </Typography>
          <div
            style={{
              gridArea: "3 / 2 / 5 / 4",
              backgroundColor: "rgb(129, 153, 165, 0.3)"
            }}
          >
            <img
              style={
                (cardStyles.imageTablet,
                {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "100% 0",
                  mixBlendMode: "multiply"
                })
              }
              className={classes.inPrisonImg}
              src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
              alt="Limits out-of-cell time for people in custody (in unit and outdoor recreation). Serious overcrowding attributing to inhumane conditions, specifically for jails"
            />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section
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
        <Typography
          variant="h2"
          className={classes.h2}
          style={{ margin: "0px" }}
        >
          Staffing Shortage
        </Typography>

        <div className={classes[`staffingShortageGrid-${screenSize}`]}>
          <Typography
            style={cardStyles.staffingCard}
            className={classes.greyBackground}
          >
            Serious overcrowding attributing to inhumane conditions,
            specifically for jails.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.forestBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>80%</span>
            Nearly 80% of People in Custody Are in Secure Settings
          </Typography>

          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgb(145,180,242)",
              gridArea: "1 / 2 / 3 / 4"
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
              alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
              className={classes.hawaiiMapImg}
              src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
            />
          </div>

          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.forestBackground} ${classes.lightFontColor} ${classes.imgOverHawaiiMap}`}
          >
            <span style={cardStyles.statisticSpan}>156%</span>
            Capacity in Jails
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${classes.navyBackground} ${classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>93%</span>
            Capacity in Prisons
          </Typography>
          <Typography
            style={cardStyles.staffingCard}
            className={classes.greyBackground}
          >
            Average rate across the country is 40-50%. Serious lack of movement
            and out-of-cell time for those in custody.
          </Typography>

          <div
            style={{
              gridArea: "1 / 5 / 3 / 6",
              backgroundColor: "rgb(129, 153, 165, 0.3)"
            }}
          >
            <img
              style={
                (cardStyles.imageTablet,
                {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "100% 0",
                  mixBlendMode: "multiply"
                })
              }
              className={classes.inPrisonImg}
              src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
              alt="Limits out-of-cell time for people in custody (in unit and outdoor recreation). Serious overcrowding attributing to inhumane conditions, specifically for jails"
            />
          </div>
        </div>
      </section>
    );
  }
};

export default withStyles(publicInfoStyles)(StaffingShortage);
