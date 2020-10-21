import colors from "./colors";
import standards from "./standards";

const styles = {
  colors,
  title: {
    color: colors.softBlack,
    fontSize: standards.fontLarge,
    letterSpacing: "1px",
    fontWeight: 500
  },
  subheading: {
    color: colors.textGray,
    fontSize: standards.fontMedium,
    fontWeight: 400
  },
  body1: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 300,
    lineHeight: "22px"
  },
  body2: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 500,
    lineHeight: "22px"
  },
  button: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 400
  },
  display: {
    color: colors.softBlack,
    fontSize: standards.fontMedium,
    fontWeight: 300,
    lineHeight: "28px"
  },
  link: {
    color: colors.oipmBlue,
    fontSize: standards.fontMedium,
    fontWeight: 400
  },
  navBarLink: {
    color: colors.textGray,
    fontSize: standards.fontSmall,
    fontWeight: 300
  }
};

export default styles;
