import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const AD_RM_RoleAdd = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { addRole, isAddingRole } = rootStore.adminRoleManagementStore;

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      selfAccessLevel: 0,
      organizationAccessLevel: 0,
      allAccessLevel: 0,
    },

    validate: (values) => {
      const errors = {};
      let accessLevels = [0, 4, 6, 7];
      if (!values.name) errors.name = "Name is required.";
      // check if access levels are valid
      if (!accessLevels.includes(values.selfAccessLevel))
        errors.selfAccessLevel = "Invalid access level.";
      if (!accessLevels.includes(values.organizationAccessLevel))
        errors.organizationAccessLevel = "Invalid access level.";
      if (!accessLevels.includes(values.allAccessLevel))
        errors.allAccessLevel = "Invalid access level.";

      // Additional validations can be added here

      return errors;
    },

    onSubmit: (newRole) => {
      console.log("newRole", newRole);
      addRole(newRole).then(() => {
        formik.resetForm();
        closeSideBar();
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
          {getErrorMessage("name")}
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
          {getErrorMessage("description")}
        </div>

        <div className="flex flex-column border-1 border-50 p-2 m-1">
          <p>Access levels to the resource:</p>
          <ul>
            <li>0 - No Access</li>
            <li>4 - Read Access (Read)</li>
            <li>6 - Write Access (Read, Write)</li>
            <li>7 - Full Access (Read, Write, Delete)</li>
          </ul>
        </div>

        <div className="field">
          <label
            htmlFor="selfAccessLevel"
            className={classNames({
              "p-error": isInvalid("selfAccessLevel"),
            })}
          >
            Self Access Level (Access to the resource is limited to the user)
          </label>
          <InputNumber
            id="selfAccessLevel"
            value={formik.values.selfAccessLevel}
            onValueChange={(e) =>
              formik.setFieldValue("selfAccessLevel", e.value)
            }
            className={classNames({
              "p-invalid": isInvalid("selfAccessLevel"),
            })}
          />
          {getErrorMessage("selfAccessLevel")}
        </div>

        <div className="field">
          <label
            htmlFor="organizationAccessLevel"
            className={classNames({
              "p-error": isInvalid("organizationAccessLevel"),
            })}
          >
            Organization Access Level (Access to the resource is limited to the
            organization)
          </label>
          <InputNumber
            id="organizationAccessLevel"
            value={formik.values.organizationAccessLevel}
            onValueChange={(e) =>
              formik.setFieldValue("organizationAccessLevel", e.value)
            }
            className={classNames({
              "p-invalid": isInvalid("organizationAccessLevel"),
            })}
          />
          {getErrorMessage("organizationAccessLevel")}
        </div>

        <div className="field">
          <label
            htmlFor="allAccessLevel"
            className={classNames({
              "p-error": isInvalid("allAccessLevel"),
            })}
          >
            All Access Level (Access to the resource is not limited)
          </label>
          <InputNumber
            id="allAccessLevel"
            value={formik.values.allAccessLevel}
            onValueChange={(e) =>
              formik.setFieldValue("allAccessLevel", e.value)
            }
            className={classNames({
              "p-invalid": isInvalid("allAccessLevel"),
            })}
          />
          {getErrorMessage("allAccessLevel")}
        </div>

        <div className="field">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Create Role"
            className="p-mt-2"
            loading={isAddingRole}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(AD_RM_RoleAdd);
