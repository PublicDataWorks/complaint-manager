import React, { useState } from "react";
import LinkButton from "../../shared/components/LinkButton";

const Collapser = props => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <section style={props.style}>
      <LinkButton onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "Show" : "Hide"} {props.name}
      </LinkButton>
      {collapsed ? "" : props.children}
    </section>
  );
};

export default Collapser;
