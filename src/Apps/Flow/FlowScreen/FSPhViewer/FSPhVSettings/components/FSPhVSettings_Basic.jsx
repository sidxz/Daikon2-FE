import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";
import { DateInit } from "../../../../../../Shared/DateLib/DateInit";
import InputOrg from "../../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../../Shared/VariableResolvers/GlobalValuesResolver";
const FSPhVSettings_Basic = () => {
  const rootStore = useContext(RootStoreContext);

  const { updateScreen, isUpdatingScreen, selectedScreen, isFetchingScreen } =
    rootStore.screenStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  if (isFetchingScreen) {
    return <Loading message={"Fetching Screen..."} />;
  }

  const formik = useFormik({
    initialValues: {
      name: selectedScreen.name,
      notes: selectedScreen.notes,
      method: selectedScreen.method,
      primaryOrgId: selectedScreen.primaryOrgId,
      primaryOrgName: selectedScreen.primaryOrgName,
      latestStatusChangeDate: DateInit(selectedScreen.latestStatusChangeDate),

      // participatingOrgsId: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.primaryOrgId)
        errors.primaryOrgId = "Primary Org is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      var screenToSubmit = { ...selectedScreen, ...newScreen };
      screenToSubmit.primaryOrgName = getOrgNameById(newScreen.primaryOrgId);
      screenToSubmit.latestStatusChangeDate = DateInit(
        screenToSubmit.latestStatusChangeDate
      );

      // if (newScreen.participatingOrgsId.length > 0) {
      //   newScreen.participatingOrgsId.forEach((orgId) => {
      //     screenToSubmit.participatingOrgs[orgId] = getOrgNameById(orgId);
      //   });
      // }

      updateScreen(screenToSubmit);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isUpdatingScreen}>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="primaryOrgName"
              className={classNames({
                "p-error": isInvalid("primaryOrgName"),
              })}
            >
              Primary Screening Organization
            </label>

            <InputOrg
              value={formik.values.primaryOrgId}
              onChange={formik.handleChange("primaryOrgId")}
              className={classNames({
                "p-invalid": isInvalid("primaryOrgId"),
              })}
            />
            {getErrorMessage("primaryOrgId")}
          </div>

          {/* <div className="field">
            <label
              htmlFor="primaryOrgName"
              className={classNames({
                "p-error": isInvalid("primaryOrgName"),
              })}
            >
              Additional Screening Organization
            </label>

            <InputMultiOrg
              value={formik.values.participatingOrgsId}
              onChange={formik.handleChange("participatingOrgsId")}
              className={classNames({
                "p-invalid": isInvalid("participatingOrgsId"),
              })}
            />
            {getErrorMessage("participatingOrgsId")}
          </div> */}

          <div className="field">
            <label
              htmlFor="method"
              className={classNames({
                "p-error": isInvalid("method"),
              })}
            >
              Method
            </label>
            <Dropdown
              id="method"
              optionLabel="name"
              answer="value"
              options={getScreeningGlobals().screeningMethods}
              value={formik.values.method}
              placeholder="Select a method"
              onChange={formik.handleChange}
              filter
              showClear
              filterBy="name"
              className={classNames({
                "p-invalid": isInvalid("method"),
              })}
            />

            {getErrorMessage("method")}
          </div>

          <div className="field">
            <label
              htmlFor="notes"
              className={classNames({
                "p-error": isInvalid("comment"),
              })}
            >
              Notes
            </label>
            <InputTextarea
              id="notes"
              answer="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("notes"),
              })}
            />
          </div>

          <div className="field">
            <label
              htmlFor="latestStatusChangeDate"
              className={classNames({
                "p-error": isInvalid("latestStatusChangeDate"),
              })}
            >
              @Override Latest Status Change Date
            </label>
            <div className="flex gap-2 align-items-center">
              <div className="flex">
                <Calendar
                  id="latestStatusChangeDate"
                  value={formik.values?.latestStatusChangeDate}
                  onChange={(e) =>
                    formik.setFieldValue("latestStatusChangeDate", e.value)
                  }
                  className={classNames({
                    "p-invalid": isInvalid("latestStatusChangeDate"),
                  })}
                />
              </div>
            </div>

            {getErrorMessage("latestStatusChangeDate")}
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Save"
            className="p-mt-2 w-2"
            loading={isUpdatingScreen}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FSPhVSettings_Basic);
