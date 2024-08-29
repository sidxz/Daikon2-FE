export const getClockIconData = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate the difference in months
    const monthsDifference = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();

    let color = null;
    let tooltipText = '';

    if (monthsDifference >= 6) {
        color = "#FA5F55";
        tooltipText = `Last updated ${monthsDifference} months ago`;
    } else if (monthsDifference >= 3) {
        color = "#FAC898";
        tooltipText = `Last updated ${monthsDifference} months ago`;
    }

    return { color, tooltipText };
};
