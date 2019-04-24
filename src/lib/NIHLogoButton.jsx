import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import NIHLogoIcon from './NIHLogoIcon';


function NIHLogoButton(props) {
    const { fontSize, ...propsEtal } = props;
    return (
        <IconButton {...propsEtal}>
            <NIHLogoIcon fontSize={fontSize} />
        </IconButton>
    );
}

export default NIHLogoButton;