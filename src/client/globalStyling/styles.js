import colors from "./colors";

const styles = {
    title: {
        color: colors.primary.main,
        fontSize: "1.3rem",
        fontWeight: 400
    },
    subheading: {
        color: colors.secondary.dark,
        fontSize: "1rem",
        fontWeight: 400
    },
    body1: {
        color: colors.secondary.dark,
        fontSize: "0.875rem",
        fontWeight: 400
    },
    caption: {
        color: colors.secondary.main,
        fontSize: "0.75rem",
        fontWeight: 400
    },
    button: {
        fontSize: "0.875rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "1px"
    },
    display1: {
        color: colors.secondary.main,
        fontSize: "0.75rem",
        fontWeight: 400,
        fontStyle: 'italic'
    },
    link:{
        color: colors.blue,
        fontSize: "0.875rem",
        fontWeight: 700,
        textDecoration: 'none'
    },
    section:{
        color: colors.secondary.dark,
        fontSize: "1rem",
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    colors: colors
}

export default styles