import { Alert } from "@material-ui/lab";
import React from "react";

interface Props {
  errorMessages: string[];
}

const ErrorAlert: React.VFC<Props> = ({ errorMessages }) => {
  return (
    <Alert>
      {errorMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </Alert>
  );
};

export default ErrorAlert;
