import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBlockUI from "../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import * as Helper from "./FTVImpactHelper";
const FTImpactValues = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isUpdatingTarget,
    updateTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  // Helper functions for form validation and error messages
  const formikValidate = (data) => {
    let errors = {};

    if (!data.bucket) {
      errors.bucket = "Bucket  is required.";
    }
    return errors;
  };

  const onFormikSubmit = (data) => {
    const updatedTarget = { ...selectedTarget, ...data };
    console.log("updatedTarget", updatedTarget);
    updateTarget(updatedTarget);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Target - " + selectedTarget?.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
        />
      </div>
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingTarget}>
          <Formik
            initialValues={{
              bucket: selectedTarget?.bucket || "",
              likeScore: selectedTarget?.likeScore,
              likeComplete: selectedTarget?.likeComplete,
              impactScore: selectedTarget?.impactScore,
              impactComplete: selectedTarget?.impactComplete,
              screeningComplete: selectedTarget?.screeningComplete,
              screeningScore: selectedTarget?.screeningScore,
              htsFeasibility: selectedTarget?.htsFeasibility,
              sbdFeasibility: selectedTarget?.sbdFeasibility,
              progressibility: selectedTarget?.progressibility,
              safety: selectedTarget?.safety,
              structureComplete: selectedTarget?.structureComplete,
              structureScore: selectedTarget?.structureScore,
              vulnerabilityRank: selectedTarget?.vulnerabilityRank,
              vulnerabilityRatio: selectedTarget?.vulnerabilityRatio,
            }}
            validate={formikValidate}
            onSubmit={onFormikSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="flex gap-3">
                  <div className="flex flex-column w-full">
                    <div className="field">
                      <label htmlFor="bucket">Bucket*</label>
                      <InputText
                        id="bucket"
                        value={values.bucket}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.bucket && touched.bucket && errors.bucket}
                    </div>

                    {/* Repeat the above pattern for other fields */}
                    <div className="field">
                      <label htmlFor="likeScore">Like Score</label>
                      <InputText
                        id="likeScore"
                        step={0.25}
                        value={values.likeScore}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.likeScore &&
                        touched.likeScore &&
                        errors.likeScore}
                    </div>

                    <div className="field">
                      <label htmlFor="likeComplete">Like Complete</label>
                      <InputText
                        id="likeComplete"
                        step={0.25}
                        value={values.likeComplete}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.likeComplete &&
                        touched.likeComplete &&
                        errors.likeComplete}
                    </div>

                    <div className="field">
                      <label htmlFor="impactScore">Impact Score</label>
                      <InputText
                        id="impactScore"
                        step={0.25}
                        value={values.impactScore}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.impactScore &&
                        touched.impactScore &&
                        errors.impactScore}
                    </div>

                    <div className="field">
                      <label htmlFor="impactComplete">Impact Complete</label>
                      <InputText
                        id="impactComplete"
                        step={0.25}
                        value={values.impactComplete}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.impactComplete &&
                        touched.impactComplete &&
                        errors.impactComplete}
                    </div>

                    <div className="field">
                      <label htmlFor="screeningComplete">
                        Screening Complete
                      </label>
                      <InputText
                        id="screeningComplete"
                        step={0.25}
                        value={values.screeningComplete}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.screeningComplete &&
                        touched.screeningComplete &&
                        errors.screeningComplete}
                    </div>

                    <div className="field">
                      <label htmlFor="screeningScore">Screening Score</label>
                      <InputText
                        id="screeningScore"
                        step={0.25}
                        value={values.screeningScore}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.screeningScore &&
                        touched.screeningScore &&
                        errors.screeningScore}
                    </div>

                    <div className="field">
                      <label htmlFor="htsFeasibility">HTS Feasibility</label>
                      <InputText
                        id="htsFeasibility"
                        step={0.25}
                        value={values.htsFeasibility}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.htsFeasibility &&
                        touched.htsFeasibility &&
                        errors.htsFeasibility}
                    </div>
                  </div>

                  <div className="flex flex-column w-full">
                    <div className="field">
                      <label htmlFor="sbdFeasibility">SBD Feasibility</label>
                      <InputText
                        id="sbdFeasibility"
                        step={0.25}
                        value={values.sbdFeasibility}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.sbdFeasibility &&
                        touched.sbdFeasibility &&
                        errors.sbdFeasibility}
                    </div>

                    <div className="field">
                      <label htmlFor="progressibility">Progressibility</label>
                      <InputText
                        id="progressibility"
                        step={0.25}
                        value={values.progressibility}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.progressibility &&
                        touched.progressibility &&
                        errors.progressibility}
                    </div>

                    <div className="field">
                      <label htmlFor="safety">Safety</label>
                      <InputText
                        id="safety"
                        step={0.25}
                        value={values.safety}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.safety && touched.safety && errors.safety}
                    </div>

                    <div className="field">
                      <label htmlFor="structureComplete">
                        Structure Complete
                      </label>
                      <InputText
                        id="structureComplete"
                        step={0.25}
                        value={values.structureComplete}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.structureComplete &&
                        touched.structureComplete &&
                        errors.structureComplete}
                    </div>

                    <div className="field">
                      <label htmlFor="structureScore">Structure Score</label>
                      <InputText
                        id="structureScore"
                        step={0.25}
                        value={values.structureScore}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.structureScore &&
                        touched.structureScore &&
                        errors.structureScore}
                    </div>

                    <div className="field">
                      <label htmlFor="vulnerabilityRank">
                        Vulnerability Rank
                      </label>
                      <InputText
                        id="vulnerabilityRank"
                        step={0.25}
                        value={values.vulnerabilityRank}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.vulnerabilityRank &&
                        touched.vulnerabilityRank &&
                        errors.vulnerabilityRank}
                    </div>

                    <div className="field">
                      <label htmlFor="vulnerabilityRatio">
                        Vulnerability Ratio
                      </label>
                      <InputText
                        id="vulnerabilityRatio"
                        step={0.25}
                        value={values.vulnerabilityRatio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.vulnerabilityRatio &&
                        touched.vulnerabilityRatio &&
                        errors.vulnerabilityRatio}
                    </div>

                    <div className="field">
                      <label
                        htmlFor="vulnerabilityRatio"
                        className="text-white-alpha-10"
                      >
                        -
                      </label>
                      <Button
                        icon="icon icon-common icon-database-submit"
                        type="submit"
                        label="Save Changes"
                        className="p-button-secondary"
                        loading={isUpdatingTarget}
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </LoadingBlockUI>
      </div>
    </div>
  );
};

export default observer(FTImpactValues);
