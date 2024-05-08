import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useContext } from "react";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaVSettingsRename = () => {
  const rootStore = useContext(RootStoreContext);

  const { isUpdatingHa, selectedHa, isFetchingHa } = rootStore.haStore;

  const formik = useFormik({
    initialValues: {
      name: selectedHa.name,
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      return errors;
    },

    // onSubmit: (newHa) => {
    //   var haToSubmit = { ...selectedHa, ...newHa };
    //   renameHa(haToSubmit);
    // },
  });

  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI blocked={isUpdatingHa || isFetchingHa}>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="name"
              className={classNames({
                "p-error": isInvalid("name"),
              })}
            >
              HA Name
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
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Save"
            className="p-mt-2 w-2"
            loading={isUpdatingHa}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FHaVSettingsRename);
