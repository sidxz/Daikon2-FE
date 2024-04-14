import { Calendar } from "primereact/calendar";
import React from "react";

const CalendarDVar = ({ id, formik, ...props }) => {
  return (
    <>
      <Calendar
        name={`${id}.value`}
        value={formik.values[id].value}
        onChange={formik.handleChange}
        {...props}
      />

      {/* <InputText
        name={`${id}.source`} // This name should match the path in formik values
        value={formik.values[id].condition.source || ""} // Ensuring controlled component
        onChange={formik.handleChange}
      /> */}
    </>
  );
};

export default CalendarDVar;
