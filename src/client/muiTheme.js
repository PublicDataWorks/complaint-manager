import getMuiTheme from 'material-ui/styles/getMuiTheme';
import colors from "./colors"

const muiTheme = getMuiTheme({
    appBar:{
        color: colors.primary
    }
});

export default muiTheme;