import React from "react";
import { Field } from "redux-form";
import PropTypes from "prop-types";
import ComplainantTypeDropdown from "./ComplainantTypeDropdown";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import { NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN } from "../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";

const PersonTypeSelection = props => {
  return (
    <>
      <Field
        name={props.typeFieldName}
        inputProps={{ showLabels: props.showLabels }}
        component={
          props.personTypes.length >
          NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN
            ? ComplainantTypeDropdown
            : ComplainantTypeRadioGroup
        }
      />
      {props.selectedType?.subTypes ? (
        <>
          <br />
          <Field
            required
            name={props.subtypeFieldName}
            component={Dropdown}
            style={{ width: "90%", marginBottom: "15px" }}
            placeholder={`Select a ${props.selectedType.description} Type`}
            inputProps={{ "data-testid": "personSubtypeDropdown" }}
          >
            {generateMenuOptions(props.selectedType.subTypes)}
          </Field>
        </>
      ) : (
        ""
      )}
      <br />
    </>
  );
};

PersonTypeSelection.propTypes = {
  personTypes: PropTypes.array,
  selectedType: PropTypes.object,
  showLabels: PropTypes.bool,
  subtypeFieldName: PropTypes.string,
  typeFieldName: PropTypes.string
};

export default PersonTypeSelection;
