import React from "react";
import { Alert } from "@material-ui/lab";

interface Props {
  errorMessage: readonly string[] | null;
}

const ErrorAlert: React.VFC<Props> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <Alert severity="error">
      {errorMessage.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </Alert>
  );
};

export default ErrorAlert;
