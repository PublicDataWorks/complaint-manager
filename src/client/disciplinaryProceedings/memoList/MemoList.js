import NavBar from "../../shared/components/NavBar/NavBar";
import React, { Component } from "react";
import { disciplinaryProceedingsMenuOptions } from "../../shared/components/NavBar/disciplinaryProceedingsMenuOptions";

export class MemoList extends Component {
  render() {
    return (
      <div>
        <NavBar showHome={false} menuType={disciplinaryProceedingsMenuOptions}>
          All Disciplinary Proceedings
        </NavBar>
      </div>
    );
  }
}
