import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
const AD_UM_UserAdd = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { addUser, isAddingUser, fetchOrgs, orgList, isFetchingOrgs } =
    rootStore.adminUserManagementStore;

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      appOrgId: "",
      appRoleIds: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required.";
      if (!values.appOrgId) errors.appOrgId = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newUser) => {
      //console.log("newUser", newUser);
      addUser(newUser).then(() => {
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

  if (isFetchingOrgs) {
    return <PleaseWait message="Fetching organizations" />;
  }

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="email"
            className={classNames({
              "p-error": isInvalid("email"),
            })}
          >
            Email *
          </label>
          <InputText
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("email"),
            })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="firstName"
            className={classNames({
              "p-error": isInvalid("firstName"),
            })}
          >
            First Name
          </label>
          <InputText
            id="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("firstName"),
            })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="lastName"
            className={classNames({
              "p-error": isInvalid("lastName"),
            })}
          >
            Last Name
          </label>
          <InputText
            id="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("lastName"),
            })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="appOrgId"
            className={classNames({
              "p-error": isInvalid("appOrgId"),
            })}
          >
            Primary Organization
          </label>

          <InputOrg
            value={formik.values.appOrgId}
            onChange={formik.handleChange("appOrgId")}
            className={classNames({
              "p-invalid": isInvalid("appOrgId"),
            })}
          />
          {getErrorMessage("appOrgId")}
        </div>

        <div className="field">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add User"
            className="p-mt-2"
            loading={isAddingUser}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(AD_UM_UserAdd);
