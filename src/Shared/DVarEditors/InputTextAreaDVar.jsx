import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

const InputTextAreaDVar = ({ id, formik, ...props }) => {
  return (
    <>
      <InputTextarea
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

export default InputTextAreaDVar;
