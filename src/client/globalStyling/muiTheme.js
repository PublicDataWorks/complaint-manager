import createMuiTheme from 'material-ui/styles/createMuiTheme'
import colors from './colors'

const muiTheme = createMuiTheme({
  palette: colors,
  typography: {
    title: {color: colors.primary[500], fontSize: "1.3rem", fontWeight: 500},
    subheading: {color: colors.secondary[900], fontSize: "1rem", fontWeight: 400},
    body1: {color: colors.secondary[900], fontSize: "0.875rem", fontWeight:400},
    caption: {color: colors.secondary[500], fontSize: "0.75rem", fontWeight: 400 },
    button: {fontSize: "0.875rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px"},
    display1: {color: colors.secondary[500], fontSize: "0.75rem", fontWeight: 400, fontStyle: 'italic'}
  }
})

export default muiTheme