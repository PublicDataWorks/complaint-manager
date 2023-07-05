import React, { useEffect } from "react";
import Auth from "../../client/common/auth/Auth";

export const Login = () => {
  useEffect(() => {
    const auth = new Auth();
    auth.login();
  }, []);

  return <div />;
};
