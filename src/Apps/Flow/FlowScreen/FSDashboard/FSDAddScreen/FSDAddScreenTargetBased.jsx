import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../Shared/VariableResolvers/GlobalValuesResolver";
import InputAssociatedTarget from "../../shared/InputAssociatedTarget";

const FSDAddScreenTargetBased = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    addScreen,
    isAddingScreen,
    fetchScreens,
    isFetchingScreen,
    isScreenListCacheValid,
  } = rootStore.screenStore;
  const {
    targetListRegistry,
    fetchTargets,
    isFetchingTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;
  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  // Ensure cache validity for screens and targets on component mount
  useEffect(() => {
    if (!isTargetListCacheValid) fetchTargets();
    if (!isScreenListCacheValid) fetchScreens();
  }, [
    fetchTargets,
    isTargetListCacheValid,
    fetchScreens,
    isScreenListCacheValid,
  ]);

  const formik = useFormik({
    initialValues: {
      associatedTargets: {},
      targetToAssociate: "",
      primaryOrgName: "",
      primaryOrgId: "",
      name: "",
      notes: "",
      method: "",
      screenType: "target-based",
      status: "Planned",
      expectedStartDate: new Date(),
      expectedCompleteDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // End date 120 days from start
    },
    validate: (values) => {
      const errors = {};
      if (!values.method) errors.method = "Method is required.";
      if (!values.targetToAssociate)
        errors.targetToAssociate = "Please select a target.";
      if (!values.name) errors.name = "Name is required.";
      if (!values.primaryOrgId)
        errors.primaryOrgId = "Organization is required.";
      return errors;
    },
    onSubmit: (newScreen) => {
      newScreen.primaryOrgName = getOrgNameById(newScreen.primaryOrgId);
      if (newScreen.targetToAssociate) {
        const targetName = targetListRegistry.get(
          newScreen.targetToAssociate
        )?.name;
        newScreen.associatedTargets = {
          [newScreen.targetToAssociate]: targetName,
        };
      }
      addScreen(newScreen).then(() => {
        closeSideBar();
        formik.resetForm();
      });
    },
  });

  // Helper functions for form validation and error messages
  const isFieldInvalid = (field) =>
    formik.touched[field] && formik.errors[field];
  const renderErrorMessage = (field) =>
    isFieldInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  // Generate suggested name based on existing target screenings
  const generateSuggestedName = () => {
    const targetId = formik.values.targetToAssociate;
    const targetScreens = rootStore.screenStore.screenList.filter(
      (screen) => screen.associatedTargets && screen.associatedTargets[targetId]
    );
    const targetName = targetListRegistry.get(targetId)?.name || "";
    return `${targetName}-${targetScreens.length + 1}`;
  };

  useEffect(() => {
    if (formik.values.targetToAssociate) {
      formik.setFieldValue("name", generateSuggestedName(), false);
    }
  }, [formik.values.targetToAssociate, formik.setFieldValue]);

  if (isFetchingTargets || isFetchingScreen) return <div>Please wait...</div>;

  // Status options with icons
  const statusOptions = [
    { name: "Planned", icon: <FcPlanner /> },
    { name: "Assay Development", icon: <FcDataSheet /> },
    { name: "Ongoing", icon: <FcNeutralTrading /> },
    { name: "Voting Ready", icon: <GiVote /> },
    { name: "Completed", icon: <FcOk /> },
  ];

  const renderOptionTemplate = (option) => (
    <div className="flex align-items-center gap-2">
      <div>{option?.icon}</div>
      <div>{option?.name || "Status Not Set"}</div>
    </div>
  );

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="targetToAssociate"
            className={classNames({
              "p-error": isFieldInvalid("targetToAssociate"),
            })}
          >
            Associated Target
          </label>
          <InputAssociatedTarget
            value={formik.values.targetToAssociate}
            onChange={formik.handleChange("targetToAssociate")}
            className={classNames({
              "p-invalid": isFieldInvalid("targetToAssociate"),
            })}
          />
          {renderErrorMessage("targetToAssociate")}
        </div>

        <div className="field">
          <label
            htmlFor="name"
            className={classNames({ "p-error": isFieldInvalid("name") })}
          >
            Name *
          </label>
          {formik.values.targetToAssociate && (
            <p className="text-xs text-gray-500">
              A suggested name has been generated based on naming conventions.
            </p>
          )}
          <InputText
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className={classNames({ "p-invalid": isFieldInvalid("name") })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="primaryOrgId"
            className={classNames({
              "p-error": isFieldInvalid("primaryOrgId"),
            })}
          >
            Screening Organization
          </label>
          <InputOrg
            value={formik.values.primaryOrgId}
            onChange={formik.handleChange("primaryOrgId")}
            className={classNames({
              "p-invalid": isFieldInvalid("primaryOrgId"),
            })}
          />
          {renderErrorMessage("primaryOrgId")}
        </div>

        <div className="field">
          <label
            htmlFor="method"
            className={classNames({ "p-error": isFieldInvalid("method") })}
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
              "p-invalid": isFieldInvalid("method"),
            })}
          />

          {renderErrorMessage("method")}
        </div>

        <div className="field">
          <label
            htmlFor="status"
            className={classNames({ "p-error": isFieldInvalid("status") })}
          >
            Status
          </label>
          <Dropdown
            id="status"
            answer="name"
            optionLabel="name"
            optionValue="name"
            options={statusOptions}
            itemTemplate={renderOptionTemplate}
            valueTemplate={renderOptionTemplate}
            value={formik.values.status}
            placeholder="Select a status"
            onChange={formik.handleChange}
            className={classNames({ "p-invalid": isFieldInvalid("status") })}
          />
          {renderErrorMessage("status")}
        </div>

        <div className="field">
          <label
            htmlFor="notes"
            className={classNames({ "p-error": isFieldInvalid("notes") })}
          >
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            className={classNames({ "p-invalid": isFieldInvalid("notes") })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="expectedStartDate"
            className={classNames({
              "p-error": isFieldInvalid("expectedStartDate"),
            })}
          >
            Expected Start Date
          </label>
          <Calendar
            id="expectedStartDate"
            view="month"
            dateFormat="MM / yy"
            value={formik.values.expectedStartDate}
            onChange={formik.handleChange}
          />
        </div>

        <div className="field">
          <label
            htmlFor="expectedCompleteDate"
            className={classNames({
              "p-error": isFieldInvalid("expectedCompleteDate"),
            })}
          >
            Expected Completion Date
          </label>
          <Calendar
            id="expectedCompleteDate"
            view="month"
            dateFormat="MM / yy"
            value={formik.values.expectedCompleteDate}
            onChange={formik.handleChange}
          />
        </div>

        <Button
          type="submit"
          label="Add Screen"
          icon="pi pi-save"
          className="p-mt-2"
          loading={isAddingScreen}
        />
      </form>
    </div>
  );
};

export default observer(FSDAddScreenTargetBased);
