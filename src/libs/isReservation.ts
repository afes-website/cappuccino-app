import { Reservation, Term } from "@afes-website/docs";
import { isList, isNumber, isObject, isString } from "typescanner";

export const isReservation = (value: unknown): value is Reservation =>
  isObject(value) &&
  isString(value.id) &&
  isTerm(value.term) &&
  isNumber(value.member_all) &&
  isNumber(value.member_checked_in);

export const isTerm = (value: unknown): value is Term =>
  isObject(value) &&
  isString(value.id) &&
  isString(value.enter_scheduled_time) &&
  isString(value.exit_scheduled_time) &&
  isList(value.guest_type, guestTypeList);

const guestTypeList = [
  "GuestBlue",
  "GuestRed",
  "GuestYellow",
  "GuestGreen",
  "ParentPurple",
  "GuestWhite",
  "StudentGray",
  "TestBlue",
  "TestRed",
  "TestYellow",
];
