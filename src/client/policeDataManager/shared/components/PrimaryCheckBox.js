import { withStyles } from "@material-ui/core/styles";
import colors from "../../../common/globalStyling/colors";
import { renderCheckbox } from "../../cases/sharedFormComponents/renderFunctions";

const styles = {
  colorSecondary: { color: colors.primary.dark },
  root: { "&$checked": { color: colors.primary.dark } },
  checked: {}
};

export default withStyles(styles)(renderCheckbox);
