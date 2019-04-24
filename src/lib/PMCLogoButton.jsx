import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import PMCLogoIcon from './PMCLogoIcon';


function PMCLogoButton(props) {
    const { fontSize, ...propsEtal } = props;
    return (
        <IconButton {...propsEtal}>
            <PMCLogoIcon fontSize={fontSize} />
        </IconButton>
    );
}

export default PMCLogoButton;