import { Calendar } from "primereact/calendar";
import FDate from "../../Library/FDate/FDate";

export const CalendarRowEditor = (options) => {
  const handleDateChange = (e) => {
    // Check if the date is null or not set, and call the callback with null in that case
    // Otherwise, pass the selected date value
    const dateValue = e.value ? e.value : null;
    options.editorCallback(dateValue);
  };

  return (
    <div className="p-float-label">
      <Calendar
        inputId="edit_date"
        value={options.value}
        onChange={handleDateChange}
        showButtonBar
        // If you want to allow clearing the date, you can enable the clear button
        // This will show a clear icon in the calendar input to easily set the value to null
        showClearButton={true}
      />
      <label htmlFor="edit_date">
        <FDate timestamp={options.value} hideTime={true} />
      </label>
    </div>
  );
};
