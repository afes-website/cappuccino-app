import "react-qr-reader";

declare module "react-qr-reader" {
  interface props {
    constraints?: MediaTrackConstraints;
  }
}

declare class QrReader extends React.Component<QrReader.props> {}

export = QrReader;
