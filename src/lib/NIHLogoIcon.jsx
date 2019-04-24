import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';


function NIHLogoIcon(props) {
    const { fontSize } = props;
    return (
        <SvgIcon fontSize={fontSize} viewBox="0 0 80.9 51.4">
          <path d="m56 14.4 v23h-4v-10.4h-10.3v10.4h-4v-23h4v9.1h10.3v-9.1zm-22.3 23h-4v-23h4zm-7.8 0h-4.2l-10.3-16.9h-0.1v16.9h-3.8v-23h4.2l10.4 16.9h0.1v-16.9h3.8zm44.1-11.6-14-25.7h-51.7c-2.6 0-4.7 2.1-4.7 4.7v41.9c0 2.6 2.1 4.7 4.7 4.7h51.6z"/>
          <path d="m60 51.4 14.1-25.7-14-25.7h3.5c1.9 0 4.3 1.4 5.2 3.1l12.3 22.6-12.4 22.6c-0.9 1.7-3.3 3.1-5.2 3.1z"/>
        </SvgIcon>
    );
}

export default NIHLogoIcon;