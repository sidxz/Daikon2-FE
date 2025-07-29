import { DVariableResolver } from "../DVariable/DVariableResolver";
import { decodeDotNetMongoGuid } from "./DecodeMongoDotNetGUID";

/**
 * Extracts and resolves tracked fields from a given event history.
 *
 * @param {Array<Object>|string} rawEventHistory - Either an array of event objects or a JSON stringified version of it.
 * @param {Array<string>} trackedFields - List of field names to extract and resolve from EventData.
 * @returns {Array<Object>} - Array of processed event objects with resolved tracked fields.
 *
 * @throws {TypeError} If trackedFields is not a valid array of strings.
 */
export const ExtractTrackedFieldsFromHistory = (
  rawEventHistory,
  trackedFields
) => {
  /* Validate input for trackedFields */
  if (
    !Array.isArray(trackedFields) ||
    !trackedFields.every((field) => typeof field === "string")
  ) {
    throw new TypeError("Expected 'trackedFields' to be an array of strings.");
  }

  let eventHistory;

  try {
    eventHistory =
      typeof rawEventHistory === "string"
        ? JSON.parse(rawEventHistory)
        : rawEventHistory;
  } catch (error) {
    console.error("Failed to parse rawEventHistory JSON:", error);
    return [];
  }

  if (!Array.isArray(eventHistory)) {
    console.error("Invalid input: 'eventHistory' must be an array.");
    return [];
  }

  return eventHistory.map((event) => {
    const timestampRaw = event?.TimeStamp?.$date?.$numberLong;
    const timeStamp = new Date(Number(timestampRaw || 0)).toISOString();

    const resolvedEvent = {
      EventType: event?.EventType ?? "Unknown",
      TimeStamp: timeStamp,
    };

    const data = event?.EventData ?? {};

    for (const field of trackedFields) {
      const fieldValue = data[field];

      // Check for .NET MongoDB GUID binary subtype
      if (fieldValue?.$binary?.subType === "03") {
        resolvedEvent[field] = decodeDotNetMongoGuid(fieldValue.$binary);
      } else {
        resolvedEvent[field] = DVariableResolver(fieldValue);
      }
    }

    return resolvedEvent;
  });
};
