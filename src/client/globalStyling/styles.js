import colors from "./colors";

const styles = {
    title: {
        color: colors.primary[500],
        fontSize: "1.3rem",
        fontWeight: 400
    },
    subheading: {
        color: colors.secondary[900],
        fontSize: "1rem",
        fontWeight: 400
    },
    body1: {
        color: colors.secondary[900],
        fontSize: "0.875rem",
        fontWeight: 400
    },
    caption: {
        color: colors.secondary[500],
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
        color: colors.secondary[500],
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
    colors: colors
}

export default styles