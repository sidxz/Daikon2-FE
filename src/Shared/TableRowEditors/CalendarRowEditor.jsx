import { Calendar } from "primereact/calendar";
import FDate from "../../Library/FDate/FDate";

export const CalendarRowEditor = (options) => {
  return (
    <div className="p-float-label">
      <Calendar
        inputId="edit_date"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
      <label htmlFor="edit_date">
        <FDate timestamp={options.value} hideTime={true} />
      </label>
    </div>
  );
};
