import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../RootStore";

const QnaireNew = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const { createQuestionnaire, isCreatingQuestionnaire } =
    rootStore.qnaireStore;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      version: "1",
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      return errors;
    },

    onSubmit: (newQuestionnaire) => {
      createQuestionnaire(newQuestionnaire).then(() => {
        closeSideBar();
        formik.resetForm();
      });
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              Name *
            </label>
            <InputText
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("name"),
              })}
            />
          </div>
          <div className="field">
            <label
              htmlFor="description"
              className={classNames({
                "p-error": isInvalid("description"),
              })}
            >
              Description
            </label>
            <InputText
              id="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("description"),
              })}
            />
          </div>
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Create Questionnaire"
            className="p-mt-2"
            loading={isCreatingQuestionnaire}
          />
        </form>
      </div>
    </>
  );
};

export default observer(QnaireNew);
