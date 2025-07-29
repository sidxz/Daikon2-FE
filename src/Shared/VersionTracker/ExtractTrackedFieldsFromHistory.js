import { DVariableResolver } from "../DVariable/DVariableResolver";
import { decodeDotNetMongoGuid } from "./DecodeMongoDotNetGUID";

/**
 * Organizes tracked variables from event history.
 * @param {Array<Object>} eventHistory - The event history array.
 * @param {Array<string>} trackedFields - List of field names to extract from EventData.
 * @returns {Array<Object>} - List of events with tracked fields resolved.
 */
export const ExtractTrackedFieldsFromHistory = (
  rawEventHistory,
  trackedFields
) => {
  console.log(rawEventHistory);
  let eventHistory;

  try {
    eventHistory =
      typeof rawEventHistory === "string"
        ? JSON.parse(rawEventHistory)
        : rawEventHistory;
  } catch (error) {
    console.error(
      "Invalid JSON input to extractTrackedFieldsFromHistory:",
      error
    );
    return [];
  }

  if (!Array.isArray(eventHistory)) {
    console.error("Expected an array of event objects.");
    return [];
  }

  return eventHistory.map((event) => {
    const result = {
      EventType: event.EventType,
      TimeStamp: new Date(
        parseInt(event.TimeStamp?.$date?.$numberLong || 0)
      ).toISOString(),
    };

    const data = event.EventData || {};

    trackedFields.forEach((field) => {
      const fieldValue = data[field];
      if (fieldValue?.$binary?.subType === "03") {
        result[field] = decodeDotNetMongoGuid(fieldValue.$binary);
      } else {
        result[field] = DVariableResolver(fieldValue);
      }
    });

    return result;
  });
};
