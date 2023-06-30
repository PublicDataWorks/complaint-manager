import React, { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

export const Login = () => {
  const { oktaAuth } = useOktaAuth();
  useEffect(() => {
    oktaAuth.signInWithRedirect();
  }, [oktaAuth]);

  return <div />;
};
