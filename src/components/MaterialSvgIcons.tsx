import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

/* These icons from google/material-design-icons is licensed under the Apache License 2.0. */

const iconPaths = {
  QRCodeScanner:
    "M9.5,6.5v3h-3v-3H9.5 M11,5H5v6h6V5L11,5z M9.5,14.5v3h-3v-3H9.5 M11,13H5v6h6V13L11,13z M17.5,6.5v3h-3v-3H17.5 M19,5h-6v6 h6V5L19,5z M13,13h1.5v1.5H13V13z M14.5,14.5H16V16h-1.5V14.5z M16,13h1.5v1.5H16V13z M13,16h1.5v1.5H13V16z M14.5,17.5H16V19h-1.5 V17.5z M16,16h1.5v1.5H16V16z M17.5,14.5H19V16h-1.5V14.5z M17.5,17.5H19V19h-1.5V17.5z M22,7h-2V4h-3V2h5V7z M22,22v-5h-2v3h-3v2 H22z M2,22h5v-2H4v-3H2V22z M2,2v5h2V4h3V2H2z",
  WristBand:
    "M20,5H6v1.5H5V5H4C2.9,5,2,5.9,2,7v10c0,1.1,0.9,2,2,2h1v-1.5h1V19h14c1.1,0,2-0.9,2-2V7C22,5.9,21.1,5,20,5z M6,16.5H5V15 h1V16.5z M6,14H5v-1.5h1V14z M6,11.5H5V10h1V11.5z M6,9H5V7.5h1V9z M14,8c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2s-2-0.9-2-2 C12,8.9,12.9,8,14,8z M18,16h-8v-1c0-1.3,2.7-2,4-2s4,0.7,4,2V16z",
  CameraOff:
    "M20,4h-3.2L15,2H9L7.2,4H6.8l3.4,3.4C10.7,7.1,11.4,7,12,7c2.8,0,5,2.2,5,5c0,0.6-0.1,1.3-0.4,1.8l5.1,5.1 c0.2-0.3,0.2-0.6,0.2-0.9V6C22,4.9,21.1,4,20,4z M15.2,12c0-1.8-1.4-3.2-3.2-3.2c-0.1,0-0.2,0-0.3,0l3.5,3.5C15.2,12.2,15.2,12.1,15.2,12z M20,20l-4.5-4.5c0,0,0,0,0,0l-1.3-1.3c0,0,0,0,0,0L9.7,9.7c0,0,0,0,0,0L8.5,8.5c0,0,0,0,0,0L5.7,5.7L2.8,2.8L1.4,4.2 l0.9,0.9C2.1,5.4,2,5.7,2,6v12c0,1.1,0.9,2,2,2h13.2l2.6,2.6l1.4-1.4L20,20L20,20z M12,17c-2.8,0-5-2.2-5-5c0-0.6,0.1-1.3,0.4-1.8 l1.5,1.5c0,0.1,0,0.2,0,0.3c0,1.8,1.4,3.2,3.2,3.2c0.1,0,0.2,0,0.3,0l1.5,1.5C13.3,16.9,12.6,17,12,17z",
  Login:
    "M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z",
  Logout:
    "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  // Person:
  //   "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  PersonSetting:
    "M6,8c0-2.2,1.8-4,4-4s4,1.8,4,4c0,2.2-1.8,4-4,4S6,10.2,6,8z M10.3,14C7.6,13.9,2,15.3,2,18v2h9.5C9.1,17.2,10.3,14.1,10.3,14z M20.8,17.6l-1,1.7c-0.1,0.1-0.2,0.1-0.3,0.1L18.3,19c-0.2,0.2-0.5,0.4-0.8,0.5l-0.2,1.3c0,0.1-0.1,0.2-0.2,0.2h-2c-0.1,0-0.2-0.1-0.2-0.2l-0.2-1.3c-0.3-0.1-0.6-0.3-0.9-0.5l-1.2,0.5c-0.1,0-0.2,0-0.3-0.1l-1-1.7c-0.1-0.1,0-0.2,0.1-0.3l1.1-0.8c0-0.2,0-0.3,0-0.5c0-0.2,0-0.3,0-0.5l-1.1-0.8c-0.1-0.1-0.1-0.2-0.1-0.3l1-1.7c0.1-0.1,0.2-0.2,0.3-0.1l1.2,0.5c0.3-0.2,0.6-0.4,0.9-0.5l0.2-1.3c0-0.1,0.1-0.2,0.2-0.2h2c0.1,0,0.2,0.1,0.2,0.2l0.2,1.3c0.3,0.1,0.6,0.3,0.8,0.5l1.2-0.5c0.1,0,0.2,0,0.3,0.1l1,1.7c0.1,0.1,0,0.2-0.1,0.3l-1.1,0.8c0,0.2,0,0.3,0,0.5c0,0.2,0,0.3,0,0.5l1.1,0.8C20.9,17.4,20.9,17.5,20.8,17.6z M17.5,16c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5c0,0.8,0.7,1.5,1.5,1.5S17.5,16.8,17.5,16z",
  PersonSecurity:
    "M6,8c0-2.2,1.8-4,4-4s4,1.8,4,4c0,2.2-1.8,4-4,4S6,10.2,6,8z M10.3,14C7.6,13.9,2,15.3,2,18v2h9.5C9.1,17.2,10.3,14.1,10.3,14z M16,10.5l-4.5,2v3c0,2.8,1.9,5.4,4.5,6c2.6-0.6,4.5-3.2,4.5-6v-3L16,10.5z M16,16h3.5c-0.3,2.1-1.6,3.9-3.5,4.5V16l-3.5,0v-2.9l3.5-1.6C16,11.6,16,16,16,16z",
  LightMode:
    "M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z",
  // mode_night
  DarkMode:
    "M9.5,2c-1.82,0-3.53,0.5-5,1.35c2.99,1.73,5,4.95,5,8.65s-2.01,6.92-5,8.65C5.97,21.5,7.68,22,9.5,22c5.52,0,10-4.48,10-10 S15.02,2,9.5,2z",
  Reload:
    "M21,10.1h-6.8L17,7.3c-2.7-2.7-7.1-2.8-9.9-0.1c-2.7,2.7-2.7,7.1,0,9.8s7.2,2.7,9.9,0c1.4-1.3,2-2.9,2-4.9h2c0,2-0.9,4.6-2.6,6.3c-3.5,3.5-9.2,3.5-12.7,0c-3.5-3.5-3.5-9.1,0-12.6s9.1-3.5,12.6,0L21,3V10.1z",
} as const;

type IconType = keyof typeof iconPaths;

type CustomSvgIconProps = SvgIconProps & {
  iconType: IconType;
};

const CustomSvgIcon: React.FC<CustomSvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d={iconPaths[props.iconType]} />
    </svg>
  </SvgIcon>
);

export const QrCodeScanner: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="QRCodeScanner" {...props} />
);
export const WristBand: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="WristBand" {...props} />
);
export const CameraOff: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="CameraOff" {...props} />
);
export const Login: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="Login" {...props} />
);
export const Logout: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="Logout" {...props} />
);
export const PersonSetting: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="PersonSetting" {...props} />
);
export const PersonSecurity: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="PersonSecurity" {...props} />
);
export const LightMode: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="LightMode" {...props} />
);
export const DarkMode: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="DarkMode" {...props} />
);
export const Reload: React.FC<SvgIconProps> = (props) => (
  <CustomSvgIcon iconType="Reload" {...props} />
);
