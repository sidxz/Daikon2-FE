import { InputText } from "primereact/inputtext";
import React from "react";

const InputTextDVar = ({ id, formik, ...props }) => {
  return (
    <>
      <InputText
        name={`${id}.value`}
        value={formik.values[id].value}
        onChange={formik.handleChange}
        {...props}
      />
      {/* 
      <InputText
        name={`${id}.source`} // This name should match the path in formik values
        value={formik.values[id].condition.source || ""} // Ensuring controlled component
        onChange={formik.handleChange}
      /> */}
    </>
  );
};

export default InputTextDVar;
