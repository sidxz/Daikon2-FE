import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { useContext } from "react";

import { InputSwitch } from "primereact/inputswitch";
import Loading from "../../../../../../Library/Loading/Loading";
import { RootStoreContext } from "../../../../../../RootStore";

const FTVGeneralSettings = () => {
  const rootStore = useContext(RootStoreContext);
  const { selectedTarget, isFetchingTarget, isUpdatingTarget, updateTarget } =
    rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  const formik = useFormik({
    initialValues: {
      isDraft: selectedTarget?.isDraft ?? false,
    },
    // No field-level validation needed right now
    validate: () => ({}),
    onSubmit: (newData) => {
      const targetToSubmit = { ...selectedTarget, ...newData };

      updateTarget(targetToSubmit);
    },
  });

  // Helpers (kept for future validations)
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) ? (
      <small className="p-error">{formik.errors[field]}</small>
    ) : null;

  return (
    <BlockUI blocked={isUpdatingTarget}>
      <div className="card w-full">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field-checkbox gap-4">
            <label htmlFor="isDraft" className="ml-2">
              Target is marked as Draft
            </label>
            <InputSwitch
              inputId="isDraft"
              name="isDraft"
              checked={formik.values.isDraft}
              onChange={(e) => formik.setFieldValue("isDraft", e.value)}
              onBlur={() => formik.setFieldTouched("isDraft", true)}
            />

            {getErrorMessage("isDraft")}
          </div>

          <Button
            icon="icon icon-common icon-database-submit"
            type="submit"
            size="small"
            label="Save"
            className="p-mt-2 w-2"
            loading={isUpdatingTarget}
          />
        </form>
      </div>
    </BlockUI>
  );
};

export default observer(FTVGeneralSettings);
