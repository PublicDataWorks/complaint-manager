import React from 'react'
import { TextField as MaterialUITextField } from 'material-ui'

const TextFieldWrapper = ({
    input,
    label,
    ...custom
}) => (
    <MaterialUITextField
        label={label}
        {...input}
        {...custom}
    />
)

export default TextFieldWrapper