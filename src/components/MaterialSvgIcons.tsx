import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

/* These icons from google/material-design-icons is licensed under the Apache License 2.0. */

const QrCodeScanner: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <rect fill="none" height="24" width="24" />
      <path d="M9.5,6.5v3h-3v-3H9.5 M11,5H5v6h6V5L11,5z M9.5,14.5v3h-3v-3H9.5 M11,13H5v6h6V13L11,13z M17.5,6.5v3h-3v-3H17.5 M19,5h-6v6 h6V5L19,5z M13,13h1.5v1.5H13V13z M14.5,14.5H16V16h-1.5V14.5z M16,13h1.5v1.5H16V13z M13,16h1.5v1.5H13V16z M14.5,17.5H16V19h-1.5 V17.5z M16,16h1.5v1.5H16V16z M17.5,14.5H19V16h-1.5V14.5z M17.5,17.5H19V19h-1.5V17.5z M22,7h-2V4h-3V2h5V7z M22,22v-5h-2v3h-3v2 H22z M2,22h5v-2H4v-3H2V22z M2,2v5h2V4h3V2H2z" />
    </svg>
  </SvgIcon>
);

// base: person, badge
const WristBand: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M20,5H6v1.5H5V5H4C2.9,5,2,5.9,2,7v10c0,1.1,0.9,2,2,2h1v-1.5h1V19h14c1.1,0,2-0.9,2-2V7C22,5.9,21.1,5,20,5z M6,16.5H5V15
	h1V16.5z M6,14H5v-1.5h1V14z M6,11.5H5V10h1V11.5z M6,9H5V7.5h1V9z M14,8c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2s-2-0.9-2-2
	C12,8.9,12.9,8,14,8z M18,16h-8v-1c0-1.3,2.7-2,4-2s4,0.7,4,2V16z"
      />
    </svg>
  </SvgIcon>
);

export { QrCodeScanner, WristBand };
