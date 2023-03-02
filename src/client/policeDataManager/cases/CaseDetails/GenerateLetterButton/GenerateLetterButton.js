import React from "react";
import { push } from "connected-react-router";
import { Menu, MenuItem } from "@material-ui/core";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import useGetServiceData from "../../../../common/hooks/useGetServiceData";
import axios from "axios";
import { connect } from "react-redux";
import {
  snackbarSuccess,
  snackbarError
} from "../../../actionCreators/snackBarActionCreators";
import getCaseDetails from "../../thunks/getCaseDetails";
import useMenuControl from "../../../../common/hooks/useMenuControl";

const GenerateLetterButton = props => {
  const { menuOpen, anchorEl, handleMenuOpen, handleMenuClose } =
    useMenuControl();
  const [letterTypes, loadLetterTypes] = useGetServiceData(
    "/api/letter-types",
    []
  );

  const generateLetter = async letterType => {
    try {
      const response = await axios.post(`/api/cases/${props.caseId}/letters`, {
        type: letterType.type
      });
      if (letterType.hasEditPage) {
        props.push(
          `/cases/${props.caseId}/letter/${response.data.id}/letter-preview`
        );
      } else {
        props.getCaseDetails(props.caseId);
        props.snackbarSuccess(
          `You have generated a new ${letterType.type} letter`
        );
      }
    } catch (error) {
      console.error(error);
      props.snackbarError(error.message);
    }

    handleMenuClose();
  };

  return (
    <div>
      <PrimaryButton
        data-testid={"generate-letter-button"}
        onClick={handleMenuOpen}
      >
        Generate Letter
      </PrimaryButton>
      <Menu
        open={menuOpen}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom" }}
        getContentAnchorEl={null}
      >
        {letterTypes.length > 0
          ? letterTypes.map(letterType => (
              <MenuItem
                key={letterType.id}
                data-testid={`${letterType.type}-option`}
                onClick={() => generateLetter(letterType)}
              >
                {letterType.type}
              </MenuItem>
            ))
          : null}
      </Menu>
    </div>
  );
};

export default connect(undefined, {
  getCaseDetails,
  snackbarSuccess,
  snackbarError,
  push
})(GenerateLetterButton);
