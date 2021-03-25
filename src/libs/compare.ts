import { Terms } from "@afes-website/docs";
import moment from "moment";

export const compareTerm = (
  termIdA: string,
  termIdB: string,
  terms: Terms
): number => {
  if (terms && termIdA in terms && termIdB in terms) {
    if (terms[termIdA].guest_type === "StudentGray") return 1;
    if (terms[termIdB].guest_type === "StudentGray") return -1;
    const timeA = moment(terms[termIdA].enter_scheduled_time);
    const timeB = moment(terms[termIdB].enter_scheduled_time);
    if (timeA.isSame(timeB)) return 0;
    if (timeA.isBefore(timeB)) return -1;
    return 1;
  }
  return 0;
};
