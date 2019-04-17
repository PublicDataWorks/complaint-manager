import React from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import { TextField } from "redux-form-material-ui";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const NoBlurTextField = ({ input, children, ...custom }) => {

  const printChildren = () => {
    console.log(children);
    console.log(input);
    console.log(custom);
  };

  const buildOptionsFromChildren = () => {
    // for(let child of children) {
    //   console.log(child.props.value + ' ' + child.props.children);
    // }
    let options = [];
    options.push(<option value="" />);
    for(let child of children) {
      options.push(<option value={child.props.value}>{child.props.children}</option>);
    }
    console.log(options);
    return options;
  };

  const suggestions = children.map(child => ({
      value: child.props.value,
      label: child.props.value
  }));

  // return (
  //   <TextField
  //     select
  //     children={children}
  //     {...input}
  //     onBlur={handleBlur}
  //     onChange={onChangeHandler}
  //     // onBlur={() => input.onBlur(input.value)}
  //     {...custom}
  //   />
  // );

  printChildren();
  const options = buildOptionsFromChildren();

  const hasError = (custom.required && custom.meta.touched && custom.meta.invalid);

    return (
        <div>
      <FormControl required={custom.required} fullWidth={true} error={hasError}>
        <InputLabel htmlFor={input.name}>{custom.label}</InputLabel>
        <NativeSelect
           {...input}
           value={input.value}
           onChange={(value) => input.onChange(value)}
           onBlur={(value) => input.onBlur(value)}
           {...custom}
        >
            {options}
        </NativeSelect>
        {hasError && <FormHelperText>{custom.meta.error}</FormHelperText>}
      </FormControl>
        </div>
    );


};
export default NoBlurTextField;
