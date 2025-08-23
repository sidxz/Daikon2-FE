import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import { hitCollectionTypeOptions } from "../../shared/FSValues";

const FSPhVAddHitCollection = ({ selectedScreen, closeSidebar }) => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();
  const {
    isAddingHitCollection,
    addHitCollection,
    selectedHitCollection,
    fetchHitCollectionsOfScreen,
    isFetchingHitCollection,
    hitCollectionOfScreen,
    isHitCollectionRegistryCacheValid,
  } = rootStore.hitCollectionStore;

  useEffect(() => {
    if (!isHitCollectionRegistryCacheValid(selectedScreen.id)) {
      fetchHitCollectionsOfScreen(selectedScreen.id, true);
    }
  }, [
    fetchHitCollectionsOfScreen,
    isHitCollectionRegistryCacheValid,
    selectedScreen?.id,
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      hitCollectionType: "",
      notes: "",
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.hitCollectionType)
        errors.hitCollectionType = "Hit collection type is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: async (hitCollection) => {
      hitCollection.screenId = selectedScreen.id;
      const newHitCollectionId = await addHitCollection(hitCollection);

      navigate(
        `/wf/screen/viewer/ph/${selectedScreen.id}/hits/${newHitCollectionId}`
      );
      closeSidebar();
      formik.resetForm();
    },
  });

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  const suggestedName = () => {
    // check if selected screen has any existing hit collections of the selected type
    const hitCollectionType = formik.values.hitCollectionType;

    var existingHitCollectionsLength = 0;
    if (hitCollectionOfScreen(selectedScreen.id)) {
      existingHitCollectionsLength = hitCollectionOfScreen(
        selectedScreen.id
      ).filter((hc) => hc.hitCollectionType === hitCollectionType).length;
    }
    const screenName = selectedScreen.name || "";
    const type = (hitCollectionType ? hitCollectionType[0] : "").toUpperCase();
    const number = existingHitCollectionsLength + 1;
    return `${screenName}-${type}${number}`;
  };

  useEffect(() => {
    // This effect runs when formik.values.targetToAssociate changes
    if (formik.values.hitCollectionType) {
      // Call the suggestedName function to get the suggested name
      const suggested = suggestedName();

      // Update the formik values with the suggested name
      formik.setFieldValue("name", suggested, false); // The third parameter is "shouldValidate", you can set it as needed
    }
  }, [formik.values.hitCollectionType, formik.setFieldValue]); // Add formik.setFieldValue to the dependency array

  return (
    <div className="card w-full">
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="hitCollectionType"
            className={classNames({
              "p-error": isInvalid("hitCollectionType"),
            })}
          >
            Hit Collection Type *
          </label>
          <Dropdown
            id="hitCollectionType"
            value={formik.values.hitCollectionType}
            options={hitCollectionTypeOptions}
            onChange={formik.handleChange}
            placeholder="Select a Hit Collection Type"
            optionLabel="name"
            autoFocus
            className={classNames({
              "p-invalid": isInvalid("hitCollectionType"),
            })}
          />
          {getErrorMessage("hitCollectionType")}
        </div>

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
            htmlFor="notes"
            className={classNames({
              "p-error": isInvalid("notes"),
            })}
          >
            Notes
          </label>
          <InputTextarea
            id="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("notes"),
            })}
          />
          {getErrorMessage("notes")}
        </div>

        <div className="flex justify-content-end">
          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            label="Add to database"
            className="p-button-secondary p-button-sm"
            loading={isAddingHitCollection}
          />
        </div>
      </form>
    </div>
  );
};

export default observer(FSPhVAddHitCollection);
