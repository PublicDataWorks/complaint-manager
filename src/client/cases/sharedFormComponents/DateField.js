import React from "react"
import {Field} from "redux-form"
import {notFutureDate} from "../../formFieldLevelValidations"
import {TextField} from "redux-form-material-ui"
import moment from "moment"

const DateField = ({inputProps, style, clearable= false, ...fieldProps}) => {
    return (
        <Field
            {...fieldProps}
            component={TextField}
            inputProps={{
                ...inputProps,
                type: "date",
                max: moment(Date.now()).format('YYYY-MM-DD')
            }}
            style={style}
            InputLabelProps={{
                shrink: true,
            }}
            validate={[notFutureDate]}
            normalize={(date, prevDate) => {
                const isValid = moment(date).isValid()
                if (!clearable) {
                    return isValid
                        ? date
                        : prevDate
                } else {
                    return isValid
                        ? date
                        : ' '
                }
            }}

        />
    )
}

export default DateField