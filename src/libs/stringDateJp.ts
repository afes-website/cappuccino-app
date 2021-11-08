import moment from "moment";
import "moment/locale/ja";

export const getStringDateJp = (date: string): string =>
  moment(date).format("M 月 D 日（dd）");

export const getStringTimeJp = (date: string): string =>
  moment(date).format("H:mm");
