import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { Typography } from "@material-ui/core";
import staffingShortageStyles from "./staffingShortageStyles";
import { colors } from "../publicInfoStyles";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const StaffingShortage = ({ screenSize, classes }) => {
  // if (screenSize === SCREEN_SIZES.MOBILE) {
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

      <div className={classes[`staffingShortageGrid-${screenSize}`]}>
        <Typography
          className={`${classes.greyBackground} ${classes.staffingCard}`}
        >
          Serious overcrowding attributing to inhumane conditions, specifically
          for jails.
        </Typography>
        <Typography
          className={` ${classes.statisticCard} ${classes.staffingCard}`}
        >
          <span className={classes.statisticSpan}>93%</span>
          Capacity in Prisons
        </Typography>
        <img
          className={classes.imageMobile}
          alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
          src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
        />
        <Typography
          className={` ${classes.staffingCard} ${classes.statisticCard}`}
          style={{ backgroundColor: colors.secondaryBrand }}
        >
          <span className={classes.statisticSpan}>156%</span>
          Capacity in Jails
        </Typography>
        <Typography
          className={` ${classes.statisticCard} ${classes.staffingCard}}`}
        >
          <span className={classes.statisticSpan}>80%</span>
          Nearly 80% of People in Custody Are in Secure Settings
        </Typography>
        <Typography
          className={`${classes.greyBackground} ${classes.staffingCard}`}
        >
          Average rate across the country is 40-50%. Serious lack of movement
          and out-of-cell time for those in custody.
        </Typography>
        <img
          className={classes.imageMobile}
          src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
          alt="Two men in orange jumpsuits and white sneakers sitting on a bench behind bars facing each other"
        />
      </div>
    </section>
  );
  // } else if (screenSize === SCREEN_SIZES.TABLET) {
  //   return (
  //     <section
  //       id="staffing-shortage"
  //       className={`${classes.staffingShortageContainer} ${
  //         classes[`staffingShortageContainer-${screenSize}`]
  //       }`}
  //     >
  //       <Typography
  //         variant="h2"
  //         className={`${classes.h2} ${classes.staffingShortageSubHeader}`}
  //       >
  //         Overall Impression
  //       </Typography>
  //       <Typography
  //         variant="h2"
  //         className={classes.h2}
  //         style={{ margin: "0px" }}
  //       >
  //         Staffing Shortage
  //       </Typography>

  //       <div className={classes[`staffingShortageGrid-${screenSize}`]}>
  //         <Typography
  //           style={cardStyles.staffingCard}
  //           className={classes.greyBackground}
  //         >
  //           Serious overcrowding attributing to inhumane conditions,
  //           specifically for jails.
  //         </Typography>
  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.navyBackground} ${classes.lightFontColor}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>93%</span>
  //           Capacity in Prisons
  //         </Typography>
  //         <img
  //           style={cardStyles.imageTablet}
  //           className={classes.hawaiiMapImg}
  //           alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
  //           src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
  //         />

  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.forestBackground} ${classes.lightFontColor} ${classes.imgOverHawaiiMap}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>156%</span>
  //           Capacity in Jails
  //         </Typography>
  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.forestBackground} ${classes.lightFontColor}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>80%</span>
  //           Nearly 80% of People in Custody Are in Secure Settings
  //         </Typography>
  //         <Typography
  //           style={cardStyles.staffingCard}
  //           className={classes.greyBackground}
  //         >
  //           Average rate across the country is 40-50%. Serious lack of movement
  //           and out-of-cell time for those in custody.
  //         </Typography>
  //         <div
  //           style={{
  //             gridArea: "3 / 2 / 5 / 4",
  //             backgroundColor: "rgb(129, 153, 165, 0.3)"
  //           }}
  //         >
  //           <img
  //             style={
  //               (cardStyles.imageTablet,
  //               {
  //                 width: "100%",
  //                 height: "100%",
  //                 objectFit: "cover",
  //                 objectPosition: "100% 0",
  //                 mixBlendMode: "multiply"
  //               })
  //             }
  //             className={classes.inPrisonImg}
  //             src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
  //             alt="Two men in orange jumpsuits and white sneakers sitting on a bench behind bars facing each other"
  //           />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // } else {
  //   return (
  //     <section
  //       id="staffing-shortage"
  //       className={`${classes.staffingShortageContainer} ${
  //         classes[`staffingShortageContainer-${screenSize}`]
  //       }`}
  //     >
  //       <Typography
  //         variant="h2"
  //         className={`${classes.h2} ${classes.staffingShortageSubHeader}`}
  //       >
  //         Overall Impression
  //       </Typography>
  //       <Typography
  //         variant="h2"
  //         className={classes.h2}
  //         style={{ margin: "0px" }}
  //       >
  //         Staffing Shortage
  //       </Typography>

  //       <div className={classes[`staffingShortageGrid-${screenSize}`]}>
  //         <Typography
  //           style={cardStyles.staffingCard}
  //           className={classes.greyBackground}
  //         >
  //           Serious overcrowding attributing to inhumane conditions,
  //           specifically for jails.
  //         </Typography>
  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.forestBackground} ${classes.lightFontColor}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>80%</span>
  //           Nearly 80% of People in Custody Are in Secure Settings
  //         </Typography>

  //         <div
  //           style={{
  //             width: "100%",
  //             height: "100%",
  //             background: "rgb(145,180,242)",
  //             gridArea: "1 / 2 / 3 / 4"
  //           }}
  //         >
  //           <img
  //             style={{
  //               width: "100%",
  //               height: "100%",
  //               objectFit: "contain"
  //             }}
  //             alt="Map of Hawaii’s correctional facilities, 4 prisons and 4 jails"
  //             className={classes.hawaiiMapImg}
  //             src={`${config.frontendUrl}/images/Hawaii-Map-Prison.png`}
  //           />
  //         </div>

  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.forestBackground} ${classes.lightFontColor} ${classes.imgOverHawaiiMap}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>156%</span>
  //           Capacity in Jails
  //         </Typography>
  //         <Typography
  //           style={(cardStyles.staffingCard, cardStyles.statisticCard)}
  //           className={`${classes.navyBackground} ${classes.lightFontColor}`}
  //         >
  //           <span style={cardStyles.statisticSpan}>93%</span>
  //           Capacity in Prisons
  //         </Typography>
  //         <Typography
  //           style={cardStyles.staffingCard}
  //           className={classes.greyBackground}
  //         >
  //           Average rate across the country is 40-50%. Serious lack of movement
  //           and out-of-cell time for those in custody.
  //         </Typography>

  //         <div
  //           style={{
  //             gridArea: "1 / 5 / 3 / 6",
  //             backgroundColor: "rgb(129, 153, 165, 0.3)"
  //           }}
  //         >
  //           <img
  //             style={
  //               (cardStyles.imageTablet,
  //               {
  //                 width: "100%",
  //                 height: "100%",
  //                 objectFit: "cover",
  //                 objectPosition: "100% 0",
  //                 mixBlendMode: "multiply"
  //               })
  //             }
  //             className={classes.inPrisonImg}
  //             src={`${config.frontendUrl}/images/MenPrison_StockImg.jpeg`}
  //             alt="Two men in orange jumpsuits and white sneakers sitting on a bench behind bars facing each other"
  //           />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }
};

export default withStyles(staffingShortageStyles)(StaffingShortage);
