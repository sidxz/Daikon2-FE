import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import { AppOrgResolver } from "../../../../../../Shared/VariableResolvers/AppOrgResolver";
import { GlobalValuesResolver } from "../../../../../../Shared/VariableResolvers/GlobalValuesResolver";
import InputAssociatedTarget from "../../../shared/InputAssociatedTarget";
const FSTbVSettings_UpdateTarget = () => {
  const rootStore = useContext(RootStoreContext);

  const {
    updateTargetAssociation,
    isUpdatingScreen,
    selectedScreen,
    isFetchingScreen,
  } = rootStore.screenStore;
  const {
    targetListRegistry,
    fetchTargets,
    isFetchingTargets,
    isTargetListCacheValid,
  } = rootStore.targetStore;

  const { getScreeningGlobals } = GlobalValuesResolver();
  const { getOrgNameById } = AppOrgResolver();

  useEffect(() => {
    if (!isTargetListCacheValid) {
      fetchTargets();
    }
  }, [fetchTargets, isTargetListCacheValid]);

  const formik = useFormik({
    initialValues: {
      targetToAssociate: Object.keys(selectedScreen.associatedTargets)[0],

      // participatingOrgsId: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.targetToAssociate)
        errors.method = "Target Association is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newScreen) => {
      var screenToSubmit = { ...selectedScreen, ...newScreen };
      const targetName = targetListRegistry.get(
        screenToSubmit.targetToAssociate
      ).name;
      screenToSubmit.associatedTargets = {
        [screenToSubmit.targetToAssociate]: targetName,
      };

      updateTargetAssociation(screenToSubmit);
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  return (
    <BlockUI
      blocked={isUpdatingScreen || isFetchingTargets || isFetchingScreen}
    >
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="targetToAssociate"
              className={classNames({
                "p-error": isInvalid("targetToAssociate"),
              })}
            >
              Associated Target
            </label>

            <InputAssociatedTarget
              value={formik.values.targetToAssociate}
              onChange={formik.handleChange("targetToAssociate")}
              className={classNames({
                "p-invalid": isInvalid("targetToAssociate"),
              })}
            />
            {getErrorMessage("targetToAssociate")}
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

export default observer(FSTbVSettings_UpdateTarget);
