import { createTheme } from "@material-ui/core/styles";
import styles from "./styles";

const muiTheme = createTheme({
  palette: styles.colors,
  typography: {
    h6: styles.title,
    subtitle1: styles.subheading,
    body2: styles.body1,
    caption: styles.caption,
    button: styles.button,
    h4: styles.display1,
    subtitle2: styles.section
  }
});

export default muiTheme;
