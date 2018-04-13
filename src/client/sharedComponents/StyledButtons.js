import {Button} from 'material-ui'
import React from 'react'

export const CancelButton = ({children, onClick, ...other}) => {
  return (
    <Button
      raised
      onClick={onClick}
      color="secondary"
      {...other}>{children}</Button>
  )
}

export const SubmitButton = ({children, onClick, ...other}) => {
  return (
    <Button
      raised
      onClick={onClick}
      type="submit"
      color="primary"
      {...other}>{children}</Button>
  )
}




