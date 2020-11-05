import { createMuiTheme } from "@material-ui/core/styles";
import styles from "./styles";

const muiTheme = createMuiTheme({
  palette: styles.colors,
  typography: {
    fontFamily: [
      "SF Compact Display Medium",
      "SF Compact Display",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ].join(","),
    h2: styles.title,
    subtitle1: styles.subheading,
    body1: styles.body1,
    body2: styles.body2,
    button: styles.button,
    h3: styles.display
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 767,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});

export default muiTheme;
