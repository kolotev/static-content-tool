import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

function addAriaLabel(props) {
    return { ariaLabel: `${props.primary}: ${props.secondary}`, ...props };
}

{/* 
    const styles = theme => ({
        className: {
            '&:hover': {
                textDecoration: 'underline',
            }
        }
    })
*/}

function AppMenu() { // props

    const menuItems = [
        addAriaLabel({ primary: "Drafts", secondary: "aka workspaces, branches", href: "/drafts/"}),
        addAriaLabel({ primary: "Reviews", secondary: "aka pull requests", href: "/reviews/"}),
        addAriaLabel({ primary: "Publish", secondary: "deploy to sites", href: "/publish/"}),
        {divider: true},
        addAriaLabel({ primary: "Team", secondary: "add, delete memeber; assign roles", href: "/Team/"}),
        addAriaLabel({ primary: "Repositories", secondary: "add, update, delete repository", href: "/repos/"})
    ];

    return (
        <MenuList>
            {
                menuItems.map(({primary, secondary, href, ariaLabel, divider}, idx) => (
                    divider === true
                    ? <Divider light variant="middle" key={idx}/>
                    : <MenuItem key={idx} component={Link} href={href} aria-label={ariaLabel}>
                                <ListItemIcon>
                                    <Icon>star</Icon>
                                </ListItemIcon>
                            <ListItemText primary={primary} secondary={secondary} />
                      </MenuItem>
                ))
            }
            
        </MenuList>
    );

}

export default AppMenu;