import NavBar from "../../../complaintManager/shared/components/NavBar/NavBar";
import React, { Component } from "react";
import { connect } from "react-redux";
import getUsers from "../thunks/getUsers";
import DropdownSelect from "../../../complaintManager/cases/CaseDetails/CivilianDialog/DropdownSelect";
import { generateMenuOptions } from "../../../complaintManager/utilities/generateMenuOptions";
import { matrixManagerMenuOptions } from "../../../complaintManager/shared/components/NavBar/matrixManagerMenuOptions";
import CreateMatrixButton from "./CreateMatrixButton";

class MatrixList extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <div>
        <NavBar showHome={false} menuType={matrixManagerMenuOptions}>
          All Matrices
        </NavBar>
        <CreateMatrixButton />
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
