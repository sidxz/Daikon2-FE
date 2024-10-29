import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { FcDataSheet, FcNeutralTrading, FcOk, FcPlanner } from "react-icons/fc";
import { GiVote } from "react-icons/gi";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
const FSDAddScreenPhenotypic = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const { addScreen, isAddingScreen } = rootStore.screenStore;
  const { getOrgNameById } = AppOrgResolver();

  const formik = useFormik({
    initialValues: {
      primaryOrgName: "",
      primaryOrgId: "",
      name: "",
      notes: "",
      screenType: "phenotypic",
      status: "Planned",
      expectedStartDate: new Date(),
      expectedCompleteDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // End date 120 days from start
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.primaryOrgId)
        errors.primaryOrgId = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      newScreen.primaryOrgName = getOrgNameById(newScreen.primaryOrgId);
      addScreen(newScreen).then(() => {
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

  // The set of available options for the status of a screen
  const statusOptions = [
    { name: "Planned", icon: <FcPlanner /> },
    { name: "Assay Development", icon: <FcDataSheet /> },
    { name: "Ongoing", icon: <FcNeutralTrading /> },
    { name: "Voting Ready", icon: <GiVote /> },
    { name: "Completed", icon: <FcOk /> },
  ];

  // Template for rendering a selected status option
  const statusOptionTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  const statusValueTemplate = (option) => {
    if (option === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Status Not Set</div>
        </div>
      );
    }
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

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
              htmlFor="primaryOrgName"
              className={classNames({
                "p-error": isInvalid("primaryOrgName"),
              })}
            >
              Screening Organization
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
          <div className="field">
            <label
              htmlFor="status"
              className={classNames({
                "p-error": isInvalid("status"),
              })}
            >
              Status
            </label>
            <Dropdown
              id="status"
              answer="name"
              optionLabel="name"
              optionValue="name"
              options={statusOptions}
              itemTemplate={statusOptionTemplate}
              valueTemplate={statusValueTemplate}
              value={formik.values.status}
              placeholder="Select a status"
              onChange={formik.handleChange}
              className={classNames({
                "p-invalid": isInvalid("status"),
              })}
            />

            {getErrorMessage("status")}
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
              htmlFor="expectedStartDate"
              className={classNames({
                "p-error": isInvalid("expectedStartDate"),
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
                "p-error": isInvalid("expectedCompleteDate"),
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
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add Screen"
            className="p-mt-2"
            loading={isAddingScreen}
          />
        </form>
      </div>
    </>
  );
};

export default observer(FSDAddScreenPhenotypic);
