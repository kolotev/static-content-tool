import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function MenuButton(props) {
    const { fontSize, ...propsEtal } = props;
    return (
      <IconButton {...propsEtal}>
        <MenuIcon fontSize={fontSize} />
      </IconButton>
    );
}

export default MenuButton;