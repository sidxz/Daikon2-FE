import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../RootStore";

const AD_UM_OrgAdd = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { addOrg, isAddingOrg, fetchOrgs } = rootStore.adminUserManagementStore;

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const formik = useFormik({
    initialValues: {
      name: "",
      alias: "",
      address: "",
      phone: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.alias) errors.alias = "Alias is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newOrg) => {
      console.log("newOrg", newOrg);
      addOrg(newOrg).then(() => {
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

        <div className="field">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add Organization"
            className="p-mt-2"
            loading={isAddingOrg}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(AD_UM_OrgAdd);
