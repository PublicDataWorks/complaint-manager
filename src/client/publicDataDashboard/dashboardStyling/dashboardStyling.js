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
  }
});

export default muiTheme;
