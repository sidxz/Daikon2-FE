export const DateValidators = () => {
  const isDateValid = (timestamp) => {
    // Explicitly check for null or undefined
    if (timestamp === null || timestamp === undefined) {
      return false;
    }

    // Check for a specific default date format or any date in year 0001
    if (/^0001-01-01T00:00:00(Z)?$/.test(timestamp)) {
      return false;
    }

    // Attempt to parse the timestamp into a Date object
    const date = new Date(timestamp);

    // Check if the Date object represents a valid date
    if (isNaN(date.getTime())) {
      return false;
    }

    return true;
  };

  return { isDateValid };
};
