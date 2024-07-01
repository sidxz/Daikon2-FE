import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";

const AD_UM_OrgEdit = () => {
  const rootStore = useContext(RootStoreContext);
  const { fetchOrg, selectedOrg, isFetchingOrg, updateOrg, isUpdatingOrg } =
    rootStore.adminUserManagementStore;

  const params = useParams();

  useState(() => {
    if (selectedOrg === null || selectedOrg?.id !== params?.id) {
      fetchOrg(params?.id);
    }
  }, [params.id, fetchOrg, selectedOrg]);

  const formik = useFormik({
    initialValues: {
      name: selectedOrg?.name || "",
      alias: selectedOrg?.alias || "",
      address: selectedOrg?.address || "",
      phone: selectedOrg?.phone || "",
      isInternal: selectedOrg?.isInternal || false,
    },
    enableReinitialize: true,

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.alias) errors.alias = "Alias is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (updatedOrg) => {
      let data = { ...selectedOrg, ...updatedOrg };
      updateOrg(data);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingOrg) {
    return <Loading message="Fetching Org..." />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-fw pi-user-plus"
          heading="Org Management"
          color={appColors.admin.userManagement.orgs}
        />
      </div>

      <div className="flex w-full border-1 border-50 border-round-md p-1 m-1 align-items-right">
        <div className="flex w-4"></div>
        <div className="flex w-6 p-2">
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
                  htmlFor="alias"
                  className={classNames({
                    "p-error": isInvalid("alias"),
                  })}
                >
                  Alias *
                </label>
                <InputText
                  id="alias"
                  value={formik.values.alias}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("alias"),
                  })}
                />
              </div>

              <div className="field">
                <label
                  htmlFor="address"
                  className={classNames({
                    "p-error": isInvalid("address"),
                  })}
                >
                  Address
                </label>
                <InputText
                  id="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("address"),
                  })}
                />
              </div>

              <div className="field">
                <label
                  htmlFor="phone"
                  className={classNames({
                    "p-error": isInvalid("phone"),
                  })}
                >
                  Phone
                </label>

                <InputText
                  id="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isInvalid("phone"),
                  })}
                />
                {getErrorMessage("phone")}
              </div>

              <div className="flex gap-4 m-2 align-items-center">
                <div className="flex">
                  <label
                    htmlFor="isInternal"
                    className={classNames({
                      "p-error": isInvalid("isInternal"),
                    })}
                  >
                    Is Internal? Internal Orgs are not visible in UI org
                    dropdowns.
                  </label>
                </div>
                <div className="flex">
                  <InputSwitch
                    id="isInternal"
                    checked={formik.values.isInternal}
                    onChange={(e) =>
                      formik.setFieldValue("isInternal", e.value)
                    }
                    className={classNames({
                      "p-invalid": isInvalid("isInternal"),
                    })}
                  />
                  {getErrorMessage("isInternal")}
                </div>
              </div>

              <div className="field">
                <Button
                  icon="icon icon-common icon-database-submit"
                  type="submit"
                  label="Update org"
                  className="p-mt-2"
                  loading={isUpdatingOrg}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(AD_UM_OrgEdit);
