import React from "react";
import {TextField} from "redux-form-material-ui";

const NoBlurTextField = ({input, children, ...custom }) => {
    return (
        <TextField
            select
            children={children}
            {...input}
            onBlur={() => input.onBlur(input.value)}
            {...custom}
        />
    )
}
export default NoBlurTextField


