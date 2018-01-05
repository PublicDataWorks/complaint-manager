import createMuiTheme from 'material-ui/styles/createMuiTheme'
import colors from './colors'

const muiTheme = createMuiTheme({
    palette: colors,
    typography: {
        headline: {color: colors.primary[500], fontSize: "24pt"},
        title: {color: colors.primary[500], fontSize: "1.3rem", fontWeight: 500},
        subheading: {color: colors.secondary[900], fontSize: "16pt"},
        body2: {color: colors.secondary[900], fontSize: "14pt", fontWeight: "bold"},
        body1: {color: colors.secondary[900], fontSize: "14pt"},
        caption: {color: colors.secondary[900], fontSize: "12pt"},
        button: {fontSize: "12pt", fontWeight: "medium", textTransform: "uppercase", letterSpacing: "1px"},
    }
})

export default muiTheme