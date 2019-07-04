import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

const Theme = createMuiTheme({
    palette: {
        primary: {
            light: purple[200],
            main: purple[400],
            dark: purple[600]
        },
        secondary: {
            light: purple[300],
            main: purple[500],
            dark: purple[700]
        },
        type: "dark"
    },
});

export default Theme;