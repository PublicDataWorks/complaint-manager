import { deepPurple, blueGrey, red } from 'material-ui/colors'

const colors = {
    primary: {
        ...deepPurple,
        300:"#9a67ea",
        900: "#320b86",
    },
    secondary: {
        ...blueGrey,
        A200: "#90a4ae",
        300: "#c1d5e0",
        500: "#90a4ae",
        700: "#62757f",
        900: "#000a12",
    },
    blue: "#1565c0",
    yellow: "#fbc02d",
    error: {
        ...red,
        500: "#d32f2f"
    },
    green: "#388e3c"
};

export default colors;