import React from 'react'
import { TextField as MaterialUITextField } from 'material-ui'

const renderTextField = ({
    input,
    label,
    ...custom
}) => (
    <MaterialUITextField
        hintText={label}
        floatingLabelText={label}
        {...input}
        {...custom}
    />
)

export default renderTextField