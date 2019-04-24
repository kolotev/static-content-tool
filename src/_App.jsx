import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import AppTheme from './lib/Theme';
import AppTopBar from './lib/AppTopBar';


const styles = theme => ({
    app: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(6),
        position: 'relative',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(640 + theme.spacing(4))]: {
            width: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
});

function _App(props) {
    const { isMenu, title, classes } = props;
    return (
        <AppTheme>
            <div className={classes.app}>
                <AppTopBar title={title} isMenu={isMenu}/>
                <main className={classes.content}>
                    {props.children}
                </main>
            </div>
        </AppTheme >
    );
}

_App.defaultProps = {
    isMenu: true,
    title: 'Static Content Tool'
};

const StyledApp = withStyles(styles)(_App);

export default StyledApp;
