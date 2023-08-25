import { useFormik } from "formik";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { RootStoreContext } from "../../../../../../../app/stores/rootStore";

/*
 * Component: PhenotypicScreenSequenceAddForm
 */
const PhenotypicScreenSequenceAddForm = ({ screenId, onAdd, loading }) => {
  // State for filtered researchers
  const [filteredResearchers, setFilteredResearchers] = useState([]);

  // Accessing the root store and appVars from the general store
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;

  // Handler for researcher search
  const searchResearcher = (event) => {
    const query = event.query;
    const filteredResults = appVars.appUsersFlattened.filter((username) =>
      username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResearchers(filteredResults);
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      library: "",
      librarySize: 0,
      startDate: "",
      endDate: undefined,
      scientist: "",
      protocol: "",
      noOfCompoundsScreened: 0,
      comment: "",
      unverifiedHitCount: 0,
      hitRate: 0,

      confirmedHitCount: 0,
    },
    validationSchema: Yup.object({
      library: Yup.string().required("Library is required."),
    }),
    onSubmit: (data) => {
      data["screenId"] = screenId;
      onAdd(data);
      formik.resetForm();
    },
  });

  return (
    <div className="flex p-2">
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          {/* Library field */}
          <div className="field">
            <label htmlFor="library">Library</label>
            <InputText
              id="library"
              name="library"
              type="text"
              className={classNames({
                "p-invalid": formik.errors.library,
              })}
              {...formik.getFieldProps("library")}
              autoFocus
            />
          </div>

          {/* Library Size field */}
          <div className="field">
            <label htmlFor="librarySize">Library Size</label>
            <InputText
              id="librarySize"
              name="librarySize"
              type="number"
              className={classNames({
                "p-invalid": formik.errors.librarySize,
              })}
              {...formik.getFieldProps("librarySize")}
            />
          </div>

          {/* Protocol field */}
          <div className="field">
            <label htmlFor="protocol">Protocol</label>
            <InputTextarea
              rows={5}
              id="protocol"
              name="protocol"
              className={classNames({
                "p-invalid": formik.errors.protocol,
              })}
              {...formik.getFieldProps("protocol")}
            />
          </div>

          {/* No of Compounds Screened field */}
          <div className="field">
            <label htmlFor="noOfCompoundsScreened">
              Total Compounds Screened
            </label>
            <InputText
              id="noOfCompoundsScreened"
              name="noOfCompoundsScreened"
              className={classNames({
                "p-invalid": formik.errors.noOfCompoundsScreened,
              })}
              {...formik.getFieldProps("noOfCompoundsScreened")}
            />
          </div>

          {/* Initial Hit Count field */}
          <div className="field">
            <label htmlFor="unverifiedHitCount">Initial Hit Count</label>
            <InputText
              id="unverifiedHitCount"
              name="unverifiedHitCount"
              className={classNames({
                "p-invalid": formik.errors.unverifiedHitCount,
              })}
              {...formik.getFieldProps("unverifiedHitCount")}
            />
          </div>

          {/* Confirmed Hit Count field */}
          <div className="field">
            <label htmlFor="confirmedHitCount">Confirmed Hit Count</label>
            <InputText
              id="confirmedHitCount"
              name="confirmedHitCount"
              className={classNames({
                "p-invalid": formik.errors.confirmedHitCount,
              })}
              {...formik.getFieldProps("confirmedHitCount")}
            />
          </div>

          {/* Hit Rate field */}
          <div className="field">
            <label htmlFor="hitRate">Hit Rate</label>
            <InputText
              id="hitRate"
              name="hitRate"
              className={classNames({
                "p-invalid": formik.errors.hitRate,
              })}
              {...formik.getFieldProps("hitRate")}
            />
          </div>

          {/* Scientist (Screened By) field */}
          <div className="field">
            <label htmlFor="scientist">Scientist (Screened By)</label>
            <AutoComplete
              id="scientist"
              name="scientist"
              delay={1500}
              suggestions={filteredResearchers}
              completeMethod={searchResearcher}
              dropdown
              forceSelection={false}
              className={classNames({
                "p-invalid": formik.errors.scientist,
              })}
              {...formik.getFieldProps("scientist")}
            />
          </div>

          {/* Start Date field */}
          <div className="field">
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              id="startDate"
              name="startDate"
              dateFormat="dd/mm/yy"
              mask="99/99/9999"
              showIcon
              className={classNames({
                "p-invalid": formik.errors.startDate,
              })}
              {...formik.getFieldProps("startDate")}
            />
          </div>

          {/* End Date field */}
          <div className="field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              id="endDate"
              name="endDate"
              dateFormat="dd/mm/yy"
              mask="99/99/9999"
              showIcon
              className={classNames({
                "p-invalid": formik.errors.endDate,
              })}
              {...formik.getFieldProps("endDate")}
            />
          </div>

          {/* Comments field */}
          <div className="field">
            <label htmlFor="comment">Comments</label>
            <InputText
              id="comment"
              name="comment"
              className={classNames({
                "p-invalid": formik.errors.comment,
              })}
              {...formik.getFieldProps("comment")}
            />
          </div>

          {/* Submit button */}
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
