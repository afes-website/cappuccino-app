import React from "react";
import { Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface Props {
  errorMessage: readonly string[] | null;
}

const ErrorAlert: React.VFC<Props> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <Alert severity="error">
      {errorMessage.map((message, index) => (
        <Typography variant="body2" key={index}>
          {message}
        </Typography>
      ))}
    </Alert>
  );
};

export default ErrorAlert;
