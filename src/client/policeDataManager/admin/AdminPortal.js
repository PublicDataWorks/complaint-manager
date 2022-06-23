import React from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Signatures from "./Signatures";

const AdminPortal = () => (
  <main className="admin-portal">
    <NavBar menuType={policeDataManagerMenuOptions}>Admin Portal</NavBar>
    <Signatures />
  </main>
);

export default AdminPortal;
