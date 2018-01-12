import createMuiTheme from 'material-ui/styles/createMuiTheme'
import styles from './styles'

const muiTheme = createMuiTheme({
    palette: styles.colors,
    typography: {
        title: styles.title,
        subheading: styles.subheading,
        body1: styles.body1,
        caption: styles.caption,
        button: styles.button,
        display1: styles.display1
    }
})

export default muiTheme