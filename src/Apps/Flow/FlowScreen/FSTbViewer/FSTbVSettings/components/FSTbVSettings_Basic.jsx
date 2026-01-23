import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useContext, useEffect } from "react";

import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";
import { DateInit } from "../../../../../../Shared/DateLib/DateInit";
import InputOrg from "../../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../../Shared/VariableResolvers/GlobalValuesResolver";

/*
 * Component: FSTbVSettings_Basic
 * Description: Form to update screen-level basic settings such as org, method, notes, and status date
 */
const FSTbVSettings_Basic = () => {
  const rootStore = useContext(RootStoreContext);

  const { updateScreen, isUpdatingScreen, selectedScreen, isFetchingScreen } =
    rootStore.screenStore;
  const {
    targetListRegistry,
    fetchTargets,
    isFetchingTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  // Fetch targets if cache is invalid
  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  if (isFetchingScreen) {
    return <Loading message="Fetching Screen..." />;
  }

  const formik = useFormik({
    initialValues: {
      name: selectedScreen.name,
      notes: selectedScreen.notes,
      method: selectedScreen.method,
      primaryOrgId: selectedScreen.primaryOrgId,
      primaryOrgName: selectedScreen.primaryOrgName,
      latestStatusChangeDate: DateInit(selectedScreen.latestStatusChangeDate),
    },

    validate: (values) => {
      const errors = {};
      if (!values.method) errors.method = "Method is required.";
      if (!values.name) errors.name = "Name is required.";
      return errors;
    },

    onSubmit: (formData) => {
      const updatedScreen = {
        ...selectedScreen,
        ...formData,
        primaryOrgName: getOrgNameById(formData.primaryOrgId),
        latestStatusChangeDate: DateInit(formData.latestStatusChangeDate),
      };

      updateScreen(updatedScreen);
    },
  });

  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isUpdatingScreen}>
      <div className="card w-full">
        <form
          onSubmit={formik.handleSubmit}
          className="p-fluid p-formgrid grid"
        >
          {/* Primary Org */}
          <div className="field col-12 md:col-6">
            <label
              htmlFor="primaryOrgId"
              className={classNames({ "p-error": isInvalid("primaryOrgId") })}
            >
              Primary Screening Organization
            </label>
            <InputOrg
              value={formik.values.primaryOrgId}
              onChange={formik.handleChange("primaryOrgId")}
              className={classNames({ "p-invalid": isInvalid("primaryOrgId") })}
            />
            {getErrorMessage("primaryOrgId")}
          </div>

          {/* Method */}
          <div className="field col-12 md:col-6">
            <label
              htmlFor="method"
              className={classNames({ "p-error": isInvalid("method") })}
            >
              Method
            </label>
            <Dropdown
              id="method"
              options={getScreeningGlobals().screeningMethods}
              optionLabel="name"
              value={formik.values.method}
              placeholder="Select a method"
              onChange={formik.handleChange}
              filter
              showClear
              filterBy="name"
              className={classNames({ "p-invalid": isInvalid("method") })}
            />
            {getErrorMessage("method")}
          </div>

          {/* Notes */}
          <div className="field col-12">
            <label
              htmlFor="notes"
              className={classNames({ "p-error": isInvalid("notes") })}
            >
              Notes
            </label>
            <InputTextarea
              id="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              rows={4}
              className={classNames({ "p-invalid": isInvalid("notes") })}
            />
            {getErrorMessage("notes")}
          </div>

          {/* Latest Status Change Date */}
          <div className="field col-12 md:col-6">
            <label
              htmlFor="latestStatusChangeDate"
              className={classNames({
                "p-error": isInvalid("latestStatusChangeDate"),
              })}
            >
              Override Latest Status Change Date
            </label>
            <Calendar
              id="latestStatusChangeDate"
              value={formik.values.latestStatusChangeDate}
              onChange={(e) =>
                formik.setFieldValue("latestStatusChangeDate", e.value)
              }
              className={classNames({
                "p-invalid": isInvalid("latestStatusChangeDate"),
              })}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              showIcon
            />
            {getErrorMessage("latestStatusChangeDate")}
          </div>

          {/* Submit Button */}
          <div className="field col-12 md:col-3 mt-5 align-items-center ">
            <Button
              text
              raised
              icon="icon icon-common icon-database-submit"
              type="submit"
              label="Save"
              loading={isUpdatingScreen}
              className="w-full"
            />
          </div>
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FSTbVSettings_Basic);
