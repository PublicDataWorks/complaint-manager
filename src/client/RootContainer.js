import React from "react";
import App from "./App";
import { withSecurity } from "./auth";

const RootContainer = () => <App />;

export default withSecurity(RootContainer);
