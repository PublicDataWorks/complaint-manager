import React from "react";
import { Field } from "redux-form";
import PropTypes from "prop-types";
import ComplainantTypeDropdown from "./ComplainantTypeDropdown";
import ComplainantTypeRadioGroup from "./ComplainantTypeRadioGroup";
import { NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN } from "../../../../sharedUtilities/constants";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import Dropdown from "../../../common/components/Dropdown";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const PersonTypeSelection = props => {
  return (
    <>
      <Field
        name={props.typeFieldName}
        inputProps={{ showLabels: props.showLabels }}
        component={
          Object.keys(PERSON_TYPE).length >
          NUMBER_OF_COMPLAINANT_TYPES_BEFORE_SWITCHING_TO_DROPDOWN
            ? ComplainantTypeDropdown
            : ComplainantTypeRadioGroup
        }
      />
      {PERSON_TYPE[props.selectedType]?.subTypes ? (
        <>
          <br />
          <Field
            name={props.subtypeFieldName}
            component={Dropdown}
            style={{ width: "90%", marginBottom: "15px" }}
            placeholder={`Select a ${
              PERSON_TYPE[props.selectedType].description
            } Type`}
            inputProps={{ "data-testid": "personSubtypeDropdown" }}
          >
            {generateMenuOptions(PERSON_TYPE[props.selectedType].subTypes)}
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
  selectedType: PropTypes.string,
  showLabels: PropTypes.bool,
  subtypeFieldName: PropTypes.string,
  typeFieldName: PropTypes.string
};

export default PersonTypeSelection;
