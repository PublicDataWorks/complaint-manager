import NavBar from "../../shared/components/NavBar/NavBar";
import React, { Component } from "react";
import { connect } from "react-redux";
import getUsers from "../matrices/thunks/getUsers";
import DropdownSelect from "../../cases/CaseDetails/CivilianDialog/DropdownSelect";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import { disciplinaryProceedingsMenuOptions } from "../../shared/components/NavBar/disciplinaryProceedingsMenuOptions";
import CreateMatrixButton from "./CreateMatrixButton";

class MatrixList extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <div>
        <NavBar showHome={false} menuType={disciplinaryProceedingsMenuOptions}>
          All Disciplinary Proceedings
        </NavBar>
        <CreateMatrixButton />
        <DropdownSelect
          input={{
            value: null
          }}
          inputProps={{
            "data-test": "usersDropdownInput"
          }}
          data-test="usersDropdown"
          name="userValue"
          isCreatable={false}
          style={{ width: "12rem" }}
        >
          {generateMenuOptions(
            this.props.allUsers.map(user => {
              return [user.name, user.email];
            })
          )}
        </DropdownSelect>
      </div>
    );
  }
}

MatrixList.defaultProps = {
  allUsers: []
};

const mapDispatchToProps = {
  getUsers
};

const mapStateToProps = state => ({
  allUsers: state.users.all
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatrixList);
