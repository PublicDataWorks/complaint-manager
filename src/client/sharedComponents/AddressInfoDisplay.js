import React from 'react'
import formatAddress from "../utilities/formatAddress";
import {Typography} from "material-ui";

const AddresesInfoDisplay = ({testLabel, displayLabel, address}) => {
    return (
        <div style={{flex: 2, textAlign: 'left', marginRight: '20px'}}>
            <Typography
                type='caption'
            >
                {displayLabel}
            </Typography>
            <Typography
                type='body1'
                data-test={testLabel}
            >
                {Boolean(formatAddress(address)) ? formatAddress(address) : 'No address specified'}
            </Typography>
            <Typography
                type='body1'
                data-test={`${testLabel}AdditionalInfo`}
            >
                {address && address.streetAddress2 ? address.streetAddress2 : ''}
            </Typography>
        </div>
    )
}

export default AddresesInfoDisplay