import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PMCLogoButton from './PMCLogoButton';
import NIHLogoButton from './NIHLogoButton';
import MenuPopper from './MenuPopper';

{/*import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';*/}

const styles = theme => ({
    title: {
        flexGrow: 1,
        padding: theme.spacing(1.5),
    },

});

function AppTopBar(props) {
    const { classes, title, isMenu = true } = props;
    return (
        <AppBar color="default" position="static" title="Abc title">
            <Toolbar variant="regular">
                {isMenu && <MenuPopper />}
                <NIHLogoButton
                    fontSize="large"
                    href="https://www.nih.gov/"
                    aria-label="Link to NIH home page" />
                <PMCLogoButton
                    fontSize="large"
                    href="/"
                    aria-label="Link to PMC home page" />
                {/*<IconButton>
                    <Icon fontSize="large" className={classes.icon}>fiber_new</Icon>
                </IconButton>*/}
                <Typography
                    variant="h5"
                    className={classes.title}
                    noWrap
                    aria-label="Name of this application">{title}</Typography>
                <Button
                    href="/admin"
                    variant="outlined"
                    aria-label="Link to Admin page">Admin</Button>
            </Toolbar>
        </AppBar>
    );
}

export default withStyles(styles)(AppTopBar);
