import { withStyles } from "@material-ui/core/styles";
import { Checkbox } from "redux-form-material-ui";
import colors from "../../globalStyling/colors";

const styles = {
  colorSecondary: { color: colors.primary.dark },
  root: { "&$checked": { color: colors.primary.dark } },
  checked: {}
};

export default withStyles(styles)(Checkbox);
