import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../../../../../RootStore";
import InputAssociatedGenes from "../../../Shared/InputAssociatedGenes";
const FTVSettingsUpdateGeneAssociation = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    isGeneListCacheValid,
    isGeneListLoading,
    geneListRegistry,
    fetchGenes,
  } = rootStore.geneStore;
  const {
    updateGeneAssociation,
    selectedTarget,
    isUpdatingTarget,
    isFetchingTarget,
  } = rootStore.targetStore;

  useEffect(() => {
    if (!isGeneListCacheValid) {
      fetchGenes();
    }
  }, [isGeneListCacheValid, fetchGenes]);

  const formik = useFormik({
    initialValues: {
      genesIdToAssociate: Object.keys(selectedTarget?.associatedGenes),

      // participatingOrgsId: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.genesIdToAssociate)
        errors.method = "Gene Association is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newTarget) => {
      var targetToSubmit = { ...selectedTarget, ...newTarget };

      let associatedGenes = {};
      targetToSubmit.genesIdToAssociate.forEach((geneId) => {
        associatedGenes[geneId] = geneListRegistry.get(geneId).accessionNumber;
      });
      targetToSubmit.associatedGenes = associatedGenes;

      console.log(
        "FTVSettingsUpdateGeneAssociation -> targetToSubmit",
        targetToSubmit
      );

      updateGeneAssociation(targetToSubmit);
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
      blocked={isUpdatingTarget || isFetchingTarget || isGeneListLoading}
    >
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
            <label
              htmlFor="genesIdToAssociate"
              className={classNames({
                "p-error": isInvalid("genesIdToAssociate"),
              })}
            >
              Associated Genes
            </label>
            <InputAssociatedGenes
              value={formik.values.genesIdToAssociate}
              onChange={formik.handleChange("genesIdToAssociate")}
              className={classNames({
                "p-invalid": isInvalid("genesIdToAssociate"),
              })}
            />
            {getErrorMessage("genesIdToAssociate")}
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Save"
            className="p-mt-2 w-2"
            size="small"
            loading={isUpdatingTarget}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FTVSettingsUpdateGeneAssociation);
