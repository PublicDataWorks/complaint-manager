import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import publicInfoStyles, { colors } from "../publicInfoStyles";

const staffingShortageStyles = theme => ({
  ...publicInfoStyles(theme),

  staffingShortageContainer: {
    padding: "16px 0"
  },
  [`staffingShortageContainer-${SCREEN_SIZES.MOBILE}`]: {
    margin: "1.5em"
  },
  [`staffingShortageContainer-${SCREEN_SIZES.TABLET}`]: {
    margin: "1.5em"
  },
  [`staffingShortageContainer-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "4.5em 7em"
  },
  staffingShortageSubHeader: {
    color: colors.secondaryBrand,
    fontSize: "28px",
    margin: "0px"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.MOBILE}`]: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "0.75fr repeat(6, 0.75fr)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.TABLET}`]: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(4, 200px)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.DESKTOP}`]: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridTemplateRows: "repeat(2, 200px)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  [`image-${SCREEN_SIZES.MOBILE}`]: {
    width: "100%",
    height: "100%"
  },
  [`image-${SCREEN_SIZES.TABLET}`]: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  [`image-${SCREEN_SIZES.DESKTOP}`]: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  [`hawaiiMapImg-${SCREEN_SIZES.TABLET}`]: {
    gridArea: "1 / 2 / 3 / 4"
  },
  [`hawaiiMapImg-${SCREEN_SIZES.DESKTOP}`]: {
    gridArea: "1 / 2 / 3 / 4",
    objectFit: "contain"
  },
  [`imgOverHawaiiMap-${SCREEN_SIZES.TABLET}`]: {
    gridArea: "2 / 2 / 3 / 3"
  },
  [`imgOverHawaiiMap-${SCREEN_SIZES.DESKTOP}`]: {
    gridArea: "2 / 2 / 3 / 3"
  },
  [`inPrisonImg-${SCREEN_SIZES.TABLET}`]: {
    gridArea: "3 / 2 / 5 / 4"
  },
  [`inPrisonImg-${SCREEN_SIZES.DESKTOP}`]: {
    gridArea: "1 / 5 / 3 / 6"
  },
  gridCard: {
    fontFamily: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  staffingCard: {
    fontSize: "1em",
    padding: "16px",
    backgroundColor: colors.accent
  },
  statisticCard: {
    width: "90%",
    fontSize: ".9em",
    padding: "0 5% 10px 5%",
    textAlign: "center",
    color: colors.light,
    backgroundColor: colors.primaryBrand
  },
  [`statisticCard-${SCREEN_SIZES.DESKTOP}`]: {
    width: "100%",
    padding: "0"
  },
  [`statisticCardForest-${SCREEN_SIZES.TABLET}`]: {
    backgroundColor: colors.secondaryBrand
  },
  statisticSpan: {
    fontSize: "3.5em",
    fontWeight: "700"
  }
});

export default staffingShortageStyles;
