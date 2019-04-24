import 'typeface-roboto';
import React from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import CssBaseline from '@material-ui/core/CssBaseline';
import indigo from '@material-ui/core/colors/indigo';
import green from '@material-ui/core/colors/green';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: green
    },
});

function AppTheme(props) {
    return (
        <React.Fragment>
            <CssBaseline />
            <MuiThemeProvider theme={theme}>
                {props.children}
            </MuiThemeProvider>
        </React.Fragment>
    );
}

export default AppTheme;
