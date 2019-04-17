import React from "react";
import NativeSelect from "@material-ui/core/NativeSelect";
import { TextField } from "redux-form-material-ui";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';

const NoBlurTextField = ({ input, children, ...custom }) => {

  const printChildren = () => {
    console.log(children);
  };

  const buildOptionsFromChildren = () => {
    // for(let child of children) {
    //   console.log(child.props.value + ' ' + child.props.children);
    // }
    let options = [];
    let dataValue = 1;
    options.push(<option value="" />);
    for(let child of children) {
      options.push(<option value={dataValue}>{child.props.children}</option>);
      dataValue++;
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

    return (
      <div>
        <InputLabel htmlFor={input.id}>{input.label}</InputLabel>
        <NativeSelect
           {...input}
           value={input.value}
           onChange={(value) => input.onChange(value)}
           onBlur={(value) => input.onBlur(value)}
           {...custom}
        >
            {options}
        </NativeSelect>
      </div>
    );


};
export default NoBlurTextField;
