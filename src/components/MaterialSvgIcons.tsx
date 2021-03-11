import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

/* These icons from google/material-design-icons is licensed under the Apache License 2.0. */

export const QrCodeScanner: React.FC<SvgIconProps> = (props) => (
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
export const WristBand: React.FC<SvgIconProps> = (props) => (
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

// base: camera_alt
export const CameraOff: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M20,4h-3.2L15,2H9L7.2,4H6.8l3.4,3.4C10.7,7.1,11.4,7,12,7c2.8,0,5,2.2,5,5c0,0.6-0.1,1.3-0.4,1.8l5.1,5.1
		c0.2-0.3,0.2-0.6,0.2-0.9V6C22,4.9,21.1,4,20,4z"
      />
      <path d="M15.2,12c0-1.8-1.4-3.2-3.2-3.2c-0.1,0-0.2,0-0.3,0l3.5,3.5C15.2,12.2,15.2,12.1,15.2,12z" />
      <path
        d="M20,20l-4.5-4.5c0,0,0,0,0,0l-1.3-1.3c0,0,0,0,0,0L9.7,9.7c0,0,0,0,0,0L8.5,8.5c0,0,0,0,0,0L5.7,5.7L2.8,2.8L1.4,4.2
		l0.9,0.9C2.1,5.4,2,5.7,2,6v12c0,1.1,0.9,2,2,2h13.2l2.6,2.6l1.4-1.4L20,20L20,20z M12,17c-2.8,0-5-2.2-5-5c0-0.6,0.1-1.3,0.4-1.8
		l1.5,1.5c0,0.1,0,0.2,0,0.3c0,1.8,1.4,3.2,3.2,3.2c0.1,0,0.2,0,0.3,0l1.5,1.5C13.3,16.9,12.6,17,12,17z"
      />
    </svg>
  </SvgIcon>
);
