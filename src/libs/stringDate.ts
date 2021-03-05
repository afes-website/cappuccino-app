import moment from "moment";

export const getStringTime = (date: string): string =>
  moment(date).format("HH:mm");

export const getStringDate = (date: string): string =>
  moment(date).format("YYYY.MM.DD");

export const getStringDateTime = (date: string): string =>
  moment(date).format("YYYY.MM.DD HH:mm");

export const getStringFromNow = (date: string): string => {
  moment.locale("ja");
  return moment(date).fromNow();
};
