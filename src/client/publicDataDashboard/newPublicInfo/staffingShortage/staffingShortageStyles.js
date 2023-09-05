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
  hawaiiMapImg: {
    gridArea: "1 / 2 / 3 / 4"
  },
  imgOverHawaiiMap: {
    gridArea: "2 / 2 / 3 / 3"
  },
  inPrisonImg: {
    gridArea: "3 / 2 / 5 / 4"
  },
  greyBackground: {
    backgroundColor: colors.accent
  },
  navyBackground: {
    backgroundColor: colors.primaryBrand
  },
  forestBackground: {
    backgroundColor: colors.secondaryBrand
  },
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
    alignItems: "center",
    color: colors.light,
    backgroundColor: colors.primaryBrand
  }
});

export default staffingShortageStyles;
