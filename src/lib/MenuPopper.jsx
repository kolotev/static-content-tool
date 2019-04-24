import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import AppMenu from './AppMenu';
import MenuButton from './MenuButton';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(3),
    },
});

class MenuPopper extends React.Component {
    
    state = {
        open: false
    };

    handleMenuToggle = () => {
      this.setState(state => ({ open: !state.open }));
    };

    handleClose = (event) => {
        if (this.anchorEl.contains(event.target))
            return;
        this.setState({ open: false });
    };

    render () {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <React.Fragment>
                <MenuButton
                    buttonRef = { node => { this.anchorEl = node; }}
                    fontSize="large"
                    onClick={this.handleMenuToggle}
                    aria-label="Open Menu"
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-owns={open ? 'menu-list-grow' : undefined} />

                <Popper open={open}
                        className={classes.paper}
                        anchorEl={this.anchorEl}
                        transition
                        disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <AppMenu />
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </React.Fragment>
        );
    } /* render () */
}

export default withStyles(styles)(MenuPopper);
