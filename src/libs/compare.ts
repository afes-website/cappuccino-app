import { Terms } from "@afes-website/docs";
import moment from "moment";

export const compareTerm = (
  termIdA: string,
  termIdB: string,
  terms: Terms
): number => {
  if (terms && termIdA in terms && termIdB in terms) {
    if (terms[termIdA].class === "Student") return 1;
    if (terms[termIdB].class === "Student") return -1;
    return moment(terms[termIdA].enter_scheduled_time).diff(
      terms[termIdB].enter_scheduled_time
    );
  }
  return 0;
};
