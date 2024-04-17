import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import InputScientist from "../../../../../../Shared/InputEditors/InputScientist";

const FSTbScreenRunAdd = ({ screenId, closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { isAddingScreenRun, addScreenRun } = rootStore.screenRunStore;

  const formik = useFormik({
    initialValues: {
      library: "",
      protocol: "",
      librarySize: "",
      scientist: "",
      startDate: null,
      endDate: null,
      hitRate: "",
      primaryHitCount: "",
      confirmedHitCount: "",
      noOfCompoundsScreened: "",
      concentration: "",
      notes: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.library) errors.library = "Library is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (screenRunToAdd) => {
      screenRunToAdd.screenId = screenId;
      addScreenRun(screenRunToAdd).then(() => {
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
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="library"
            className={classNames({ "p-error": isInvalid("library") })}
          >
            Library
          </label>
          <InputText
            id="library"
            value={formik.values.library}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("library"),
            })}
          />
          {getErrorMessage("library")}
        </div>

        <div className="field">
          <label
            htmlFor="protocol"
            className={classNames({ "p-error": isInvalid("protocol") })}
          >
            Protocol
          </label>
          <InputTextarea
            id="protocol"
            value={formik.values.protocol}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("protocol"),
            })}
          />
          {getErrorMessage("protocol")}
        </div>

        <div className="field">
          <label
            htmlFor="concentration"
            className={classNames({ "p-error": isInvalid("concentration") })}
          >
            Concentration
          </label>
          <InputText
            id="concentration"
            value={formik.values.concentration}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("concentration"),
            })}
          />
          {getErrorMessage("concentration")}
        </div>

        <div className="field">
          <label
            htmlFor="noOfCompoundsScreened"
            className={classNames({
              "p-error": isInvalid("noOfCompoundsScreened"),
            })}
          >
            No. of compounds screened
          </label>
          <InputText
            id="noOfCompoundsScreened"
            value={formik.values.noOfCompoundsScreened}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("noOfCompoundsScreened"),
            })}
          />
          {getErrorMessage("noOfCompoundsScreened")}
        </div>

        <div className="field">
          <label
            htmlFor="scientist"
            className={classNames({ "p-error": isInvalid("scientist") })}
          >
            Scientist
          </label>
          <InputScientist
            id="scientist"
            value={formik.values.scientist}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("scientist"),
            })}
          />
          {getErrorMessage("scientist")}
        </div>

        <div className="field">
          <label
            htmlFor="startDate"
            className={classNames({
              "p-error": isInvalid("startDate"),
            })}
          >
            Start Date
          </label>
          <Calendar
            id="startDate"
            name="startDate"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            dateFormat="dd/mm/yy"
            mask="99/99/9999"
            showIcon
            className={classNames({
              "p-invalid": isInvalid("startDate"),
            })}
          />

          {getErrorMessage("startDate")}
        </div>

        <div className="field">
          <label
            htmlFor="endDate"
            className={classNames({
              "p-error": isInvalid("endDate"),
            })}
          >
            End Date
          </label>

          <Calendar
            id="endDate"
            name="endDate"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            dateFormat="dd/mm/yy"
            mask="99/99/9999"
            showIcon
            className={classNames({
              "p-invalid": isInvalid("endDate"),
            })}
          />

          {getErrorMessage("endDate")}
        </div>

        <div className="field">
          <label
            htmlFor="primaryHitCount"
            className={classNames({
              "p-error": isInvalid("primaryHitCount"),
            })}
          >
            Primary Hit Count
          </label>
          <InputText
            id="primaryHitCount"
            value={formik.values.primaryHitCount}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("primaryHitCount"),
            })}
          />
          {getErrorMessage("primaryHitCount")}
        </div>

        <div className="field">
          <label
            htmlFor="confirmedHitCount"
            className={classNames({
              "p-error": isInvalid("confirmedHitCount"),
            })}
          >
            Confirmed Hit Count
          </label>
          <InputText
            id="confirmedHitCount"
            value={formik.values.confirmedHitCount}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("confirmedHitCount"),
            })}
          />
          {getErrorMessage("confirmedHitCount")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingScreenRun}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(FSTbScreenRunAdd);
