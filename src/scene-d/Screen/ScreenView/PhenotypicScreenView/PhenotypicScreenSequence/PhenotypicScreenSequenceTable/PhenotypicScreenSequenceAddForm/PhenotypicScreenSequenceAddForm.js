import { useFormik } from "formik";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../../../../app/stores/rootStore";

const PhenotypicScreenSequenceAddForm = ({ screenId, onAdd, loading }) => {
  const [filteredResearchers, setFilteredResearchers] = useState([]);

  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;

  const searchResearcher = (event) => {
    const query = event.query;
    const filteredResults = appVars.appUsersFlattened.filter((username) =>
      username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResearchers(filteredResults);
  };

  const formik = useFormik({
    initialValues: {
      library: "",
      librarySize: "",
      startDate: "",
      endDate: undefined,
      scientist: "",
      protocol: "",
      // concentration: "",
      noOfCompoundsScreened: "",
      comment: "",
      unverifiedHitCount: "",
      hitRate: "",
      primaryHitCount: "",
      confirmedHitCount: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.library) {
        errors.library = "Library is required.";
      }
      if (!data.library) {
        errors.library = "Library Size is required.";
      }

      if (!data.startDate) {
        errors.startDate = "Start Date is required.";
      }

      if (!data.protocol) {
        errors.protocol = "Protocol is required.";
      }

      // if (!data.concentration) {
      //   errors.concentration = "Concentration is required.";
      // }

      if (!data.scientist) {
        errors.scientist = "Scientist is required.";
      }

      if (!data.noOfCompoundsScreened) {
        errors.noOfCompoundsScreened = "No of Compounds screened is required.";
      }

      if (!data.unverifiedHitCount) {
        errors.unverifiedHitCount = "Initial Hit Count is required.";
      }
      if (!data.library) {
        errors.library = "Hit Rate is required.";
      }
      if (!data.library) {
        errors.library = "Primary Hit Count is required.";
      }
      if (!data.library) {
        errors.library = "Confirmed Hit Count is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data["screenId"] = screenId;

      onAdd(data);
      formik.resetForm();
    },
  });

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  return (
    <div className="flex p-2">
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="library"
              className={classNames({
                "p-error": isFormFieldValid("library"),
              })}
            >
              Library
            </label>
            <InputText
              id="library"
              answer="library"
              value={formik.values.library}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("library"),
              })}
              autoFocus
            />

            {getFormErrorMessage("library")}
          </div>

          <div className="field">
            <label
              htmlFor="librarySize"
              className={classNames({
                "p-error": isFormFieldValid("librarySize"),
              })}
            >
              Library Size
            </label>
            <InputText
              id="librarySize"
              answer="librarySize"
              value={formik.values.librarySize}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("librarySize"),
              })}
              autoFocus
            />

            {getFormErrorMessage("librarySize")}
          </div>

          <div className="field">
            <label
              htmlFor="startDate"
              className={classNames({
                "p-error": isFormFieldValid("startDate"),
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
                "p-invalid": isFormFieldValid("startDate"),
              })}
            />

            {getFormErrorMessage("startDate")}
          </div>

          <div className="field">
            <label
              htmlFor="endDate"
              className={classNames({
                "p-error": isFormFieldValid("endDate"),
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
                "p-invalid": isFormFieldValid("endDate"),
              })}
            />

            {getFormErrorMessage("endDate")}
          </div>

          <div className="field">
            <label
              htmlFor="protocol"
              className={classNames({
                "p-error": isFormFieldValid("protocol"),
              })}
            >
              Protocol
            </label>

            <InputTextarea
              rows={5}
              id="protocol"
              answer="protocol"
              value={formik.values.protocol}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("protocol"),
              })}
            />

            {getFormErrorMessage("protocol")}
          </div>

          <div className="field">
            <label
              htmlFor="unverifiedHitCount"
              className={classNames({
                "p-error": isFormFieldValid("unverifiedHitCount"),
              })}
            >
              Initial Hit Count
            </label>
            <InputText
              id="unverifiedHitCount"
              answer="unverifiedHitCount"
              value={formik.values.unverifiedHitCount}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("unverifiedHitCount"),
              })}
            />

            {getFormErrorMessage("unverifiedHitCount")}
          </div>

          <div className="field">
            <label
              htmlFor="hitRate"
              className={classNames({
                "p-error": isFormFieldValid("hitRate"),
              })}
            >
              Hit Rate
            </label>
            <InputText
              id="hitRate"
              answer="hitRate"
              value={formik.values.hitRate}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("hitRate"),
              })}
            />

            {getFormErrorMessage("hitRate")}
          </div>

          <div className="field">
            <label
              htmlFor="primaryHitCount"
              className={classNames({
                "p-error": isFormFieldValid("primaryHitCount"),
              })}
            >
              Primary Hit Count
            </label>
            <InputText
              id="primaryHitCount"
              answer="primaryHitCount"
              value={formik.values.primaryHitCount}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("primaryHitCount"),
              })}
            />

            {getFormErrorMessage("primaryHitCount")}
          </div>

          <div className="field">
            <label
              htmlFor="confirmedHitCount"
              className={classNames({
                "p-error": isFormFieldValid("confirmedHitCount"),
              })}
            >
              Confirmed Hit Count
            </label>
            <InputText
              id="confirmedHitCount"
              answer="confirmedHitCount"
              value={formik.values.confirmedHitCount}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("confirmedHitCount"),
              })}
            />

            {getFormErrorMessage("confirmedHitCount")}
          </div>

          {/* <div className="field">
            <label
              htmlFor="concentration"
              className={classNames({
                "p-error": isFormFieldValid("concentration"),
              })}
            >
              Inhibitor Concentration (&micro;M)
            </label>
            <InputText
              id="concentration"
              answer="concentration"
              value={formik.values.concentration}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("concentration"),
              })}
            />

            {getFormErrorMessage("concentration")}
          </div> */}

          <div className="field">
            <label
              htmlFor="noOfCompoundsScreened"
              className={classNames({
                "p-error": isFormFieldValid("noOfCompoundsScreened"),
              })}
            >
              No of Compounds Screened
            </label>
            <InputText
              id="noOfCompoundsScreened"
              answer="noOfCompoundsScreened"
              value={formik.values.noOfCompoundsScreened}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("noOfCompoundsScreened"),
              })}
            />

            {getFormErrorMessage("noOfCompoundsScreened")}
          </div>

          <div className="field">
            <label
              htmlFor="scientist"
              className={classNames({
                "p-error": isFormFieldValid("scientist"),
              })}
            >
              Scientist (Screened By)
            </label>
            <AutoComplete
              id="scientist"
              value={formik.values.scientist}
              delay={1500}
              suggestions={filteredResearchers}
              completeMethod={searchResearcher}
              onChange={formik.handleChange}
              dropdown
              forceSelection={false}
              className={classNames({
                "p-invalid": isFormFieldValid("scientist"),
              })}
            />

            {getFormErrorMessage("scientist")}
          </div>

          <div className="field">
            <label
              htmlFor="comment"
              className={classNames({
                "p-error": isFormFieldValid("comment"),
              })}
            >
              Comments
            </label>
            <InputText
              id="comment"
              answer="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isFormFieldValid("comment"),
              })}
            />
          </div>
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-mt-2"
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default PhenotypicScreenSequenceAddForm;
