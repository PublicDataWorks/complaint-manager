import NavBar from "../../shared/components/NavBar/NavBar";
import React, { Component } from "react";
import { Typography } from "@material-ui/core";

export class MemoList extends Component {
  render() {
    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            All Disciplinary Proceedings
          </Typography>
        </NavBar>
      </div>
    );
  }
}
