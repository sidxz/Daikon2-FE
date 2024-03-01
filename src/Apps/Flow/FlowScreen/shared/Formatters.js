import { camelCase, startCase } from "lodash";

export const FormatScreeningMethod = (method) => {
  return startCase(camelCase(method));
};
