export const getClockIconData = (dateString) => {
  if (!dateString) return { color: null, tooltipText: "" };

  const date = new Date(dateString);
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  let color = null;
  let tooltipText = "";

  if (date < sixMonthsAgo) {
    color = "#FA5F55";
    tooltipText = "Last updated over 6 months ago";
  } else if (date < threeMonthsAgo) {
    color = "#FAC898";
    tooltipText = "Last updated over 3 months ago";
  }

  return { color, tooltipText };
};

export const getRelevantDate = (screen) => {
  const INVALID_DATES = ["0001-01-01T00:00:00", "0001-01-01T00:00:00Z"];

  if (
    screen?.deepLastUpdated &&
    !INVALID_DATES.includes(screen.deepLastUpdated)
  ) {
    return screen.deepLastUpdated;
  }

  return screen?.isModified
    ? screen?.latestStatusChangeDate || null
    : screen?.dateCreated || null;
};

export const isRecentScreen = (screen) => {
  const relevantDate = getRelevantDate(screen);
  if (!relevantDate) return false;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return new Date(relevantDate) >= sixMonthsAgo;
};
