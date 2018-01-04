import {Button} from 'material-ui'
import React from 'react'
import colors from '../globalStyling/colors'

const cancelVariant = {
  color: colors.secondary[300]
}

export const CancelButton = ({children, onClick, ...other}) => {
  return (
    <Button
      raised
      onClick={onClick}
      color="accent"
      style={cancelVariant}
      {...other}>{children}</Button>
  )
}

export const SubmitButton = ({children, onClick, ...other}) => {
  return (
    <Button
      raised
      onClick={onClick}
      color="primary"
      {...other}>{children}</Button>
  )
}



