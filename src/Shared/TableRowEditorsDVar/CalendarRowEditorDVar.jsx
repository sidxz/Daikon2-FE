import { Calendar } from "primereact/calendar";

export const CalendarRowEditorDVar = (options) => {
  let onchangeDVar = (e) => {
    let value = { value: e.target.value };
    options.editorCallback(value);
  };

  return (
    <Calendar
      inputId="edit_date"
      value={new Date(options.value?.value)}
      onChange={(e) => onchangeDVar(e)}
      showButtonBar
      // If you want to allow clearing the date, you can enable the clear button
      // This will show a clear icon in the calendar input to easily set the value to null
      showClearButton={true}
    />
  );
};
