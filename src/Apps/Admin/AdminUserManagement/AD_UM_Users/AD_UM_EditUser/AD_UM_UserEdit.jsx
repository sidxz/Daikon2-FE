import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import AuthorTag from "../../../../../Shared/TagGenerators/AuthorTag/AuthorTag";
import { appColors } from "../../../../../constants/colors";

const AD_UM_UserEdit = () => {
  console.log("AD_UM_UserEdit -> Render");

  const rootStore = useContext(RootStoreContext);
  const {
    fetchUser,
    selectedUser,
    isFetchingUser,
    updateUser,
    isUpdatingUser,
  } = rootStore.adminUserManagementStore;

  const params = useParams();

  useState(() => {
    if (selectedUser === null || selectedUser?.id !== params?.id) {
      fetchUser(params?.id);
    }
  }, [params.id, fetchUser, selectedUser]);

  const formik = useFormik({
    initialValues: {
      email: selectedUser?.email || "",
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      appOrgId: selectedUser?.appOrgId || "",
      appRoleIds: selectedUser?.appRoleIds || [],
    },
    enableReinitialize: true,

    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required.";
      if (!values.appOrgId) errors.appOrgId = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (updatedUser) => {
      let data = { ...selectedUser, ...updatedUser };
      updateUser(data);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingUser) {
    return <Loading message="Fetching User..." />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-fw pi-user-plus"
          heading="User Management"
          color={appColors.admin.userManagement.users}
        />
      </div>

      <div className="flex w-full border-1 border-50 border-round-md p-1 m-1 align-items-right">
        <div className="flex w-4">
          <AuthorTag userId={selectedUser?.id} size="xlarge" />
        </div>
        <div className="flex w-6 p-2">
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
                  label="Update user"
                  className="p-mt-2"
                  loading={isUpdatingUser}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(AD_UM_UserEdit);
