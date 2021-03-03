import React from "react";
import { render } from "react-dom";
import "./index.css";
import RootContainer from "./client/RootContainer";
import logger from "./client/logger";

window.addEventListener("error", ({ message }) => logger.error(message));

render(<RootContainer />, document.getElementById("root"));
