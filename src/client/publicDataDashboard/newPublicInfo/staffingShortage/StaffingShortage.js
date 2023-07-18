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
    padding: "2em"
  },
  statisticCard: {
    fontFamily: "inherit",
    fontSize: ".9em",
    padding: "2em",
    textAlign: "center"
  }
};

const StaffingShortage = props => {
  if (props.screenSize === SCREEN_SIZES.MOBILE) {
    return (
      <section className={props.classes.staffingShortageContainer}>
        <Typography
          variant="h2"
          className={`${props.classes.h2} ${props.classes.staffingShortageSubHeader}`}
        >
          Overall Impression
        </Typography>
        <Typography
          variant="h2"
          className={props.classes.h2}
          style={{ margin: "0px" }}
        >
          Staffing Shortage
        </Typography>

        <div
          className={props.classes[`staffingShortageGrid-${props.screenSize}`]}
        >
          <Typography
            style={cardStyles.staffingCard}
            className={props.classes.greyBackground}
          >
            Serious overcrowding attributing to inhumane conditions,
            specifically for jails.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.navyBackground} ${props.classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>93%</span>
            <br /> Prisons Are Above Capacity
          </Typography>
          <img
            style={cardStyles.imageMobile}
            src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
          />
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.forestBackground} ${props.classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>156%</span>
            <br /> Jails Are Above Capacity
          </Typography>
          <Typography
            style={cardStyles.staffingCard}
            className={props.classes.greyBackground}
          >
            Average rate across the country is 40-50%. Serious lack of movement
            and out-of-cell time for those in custody.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.forestBackground} ${props.classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>80%</span>
            <br /> Nearly 80% of People in Custody Are in Secure Settings
          </Typography>
          <img
            style={cardStyles.imageMobile}
            src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
          />
        </div>
      </section>
    );
  } else if (props.screenSize === SCREEN_SIZES.TABLET) {
    return (
      <section className={props.classes.staffingShortageContainer}>
        <Typography
          variant="h2"
          className={`${props.classes.h2} ${props.classes.staffingShortageSubHeader}`}
        >
          Overall Impression
        </Typography>
        <Typography
          variant="h2"
          className={props.classes.h2}
          style={{ margin: "0px" }}
        >
          Staffing Shortage
        </Typography>

        <div
          className={props.classes[`staffingShortageGrid-${props.screenSize}`]}
        >
          <Typography
            style={cardStyles.staffingCard}
            className={props.classes.greyBackground}
          >
            Serious overcrowding attributing to inhumane conditions,
            specifically for jails.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.navyBackground} ${props.classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>93%</span>
            <br /> Prisons Are Above Capacity
          </Typography>
          <img
            style={cardStyles.imageTablet}
            className={props.classes.hawaiiMapImg}
            src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
          />
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.forestBackground} ${props.classes.lightFontColor} ${props.classes.imgOverHawaiiMap}`}
          >
            <span style={cardStyles.statisticSpan}>156%</span>
            <br /> Jails Are Above Capacity
          </Typography>
          <Typography
            style={cardStyles.staffingCard}
            className={props.classes.greyBackground}
          >
            Average rate across the country is 40-50%. Serious lack of movement
            and out-of-cell time for those in custody.
          </Typography>
          <Typography
            style={(cardStyles.staffingCard, cardStyles.statisticCard)}
            className={`${props.classes.forestBackground} ${props.classes.lightFontColor}`}
          >
            <span style={cardStyles.statisticSpan}>80%</span>
            <br /> Nearly 80% of People in Custody Are in Secure Settings
          </Typography>
          <img
            style={cardStyles.imageTablet}
            className={props.classes.inPrisonImg}
            src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
          />
        </div>
      </section>
    );
  } else {
    return <h1>HELLO</h1>;
  }
};

export default withStyles(publicInfoStyles)(StaffingShortage);
