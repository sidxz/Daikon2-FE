import { DateValidators } from "../Validators/DateValidators";

export const DateInit = (dateValue) => {
  const { isDateValid } = DateValidators();
  if (!isDateValid(dateValue)) {
    return null;
  }
  return new Date(dateValue);
};
