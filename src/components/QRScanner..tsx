import React from "react";
import PropTypes from "prop-types";
import QrReader from "react-qr-reader";

interface Props {
  onScanFunc: (data: string | null) => void;
  videoStop: boolean;
}

const errorHandling = (err: unknown) => {
  console.log(err);
};

const QRScanner: React.FunctionComponent<Props> = (props) => {
  return (
    <QrReader
      onScan={props.onScanFunc}
      onError={errorHandling}
      delay={props.videoStop ? false : 500}
    />
  );
};

QRScanner.propTypes = {
  onScanFunc: PropTypes.func.isRequired,
  videoStop: PropTypes.bool.isRequired,
};

export default QRScanner;
