import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Formik } from "formik";
import { InputText } from "primereact/inputtext";
import Loading from "../../../../../Library/Loading/Loading";
import SecHeading from "../../../../../Library/SecHeading/SecHeading";
import { RootStoreContext } from "../../../../../RootStore";
import { appColors } from "../../../../../constants/colors";
import { TargetIcon } from "../../../icons/TargetIcon";
import FTVApconixGrid from "./FTVApconixGrid";
import * as Helper from "./FTVApconixHelper";
import FTVApconixLegend from "./FTVApconixLegend";

const FTVApconix = () => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const params = useParams();

  const {
    fetchTarget,
    selectedTarget,
    isFetchingTarget,
    isUpdatingTarget,
    isTargetRegistryCacheValid,
  } = rootStore.targetStore;

  if (isFetchingTarget) {
    return <Loading message={"Fetching Target..."} />;
  }

  const onFormikSubmit = (data) => {
    const updatedTarget = { ...selectedTarget, ...data };
    //console.log("updatedTarget", updatedTarget);
    updateTarget(updatedTarget);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-0">
      <div className="flex w-full">
        <BreadCrumb model={Helper.breadCrumbItems(selectedTarget, navigate)} />
      </div>
      <div className="flex w-full">
        <SecHeading
          svgIcon={<TargetIcon size={"25em"} />}
          heading={"Target - " + selectedTarget.name}
          color={appColors.sectionHeadingBg.target}
          displayHorizon={true}
          entryPoint={selectedTarget?.id}
        />
      </div>

      <div className="flex w-full">
        <Fieldset className="m-0 w-full" legend="General information">
          <div className="flex gap-5">
            <Formik
              initialValues={{
                mammalianTarget: selectedTarget?.mammalianTarget,
                mtbDrugBindingDomain: selectedTarget?.mtbDrugBindingDomain,
              }}
              onSubmit={onFormikSubmit}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit} className="p-fluid">
                  <div className="flex">
                    <div className="flex gap-5 w-full">
                      {/* <div className="field flex items-center gap-3">
                        <label htmlFor="mammalianTarget">
                          Mammalian target
                        </label>
                        <InputText
                          id="mammalianTarget"
                          value={values.mammalianTarget}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div> */}
                      <div className="field flex items-center gap-3">
                        <label htmlFor="mammalianOffTarget">
                          Mammalian off target
                        </label>
                        <InputText
                          id="mammalianOffTarget"
                          value={values.mammalianTarget}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <div className="field flex items-center gap-5">
                        <label htmlFor="mtbDrugBindingDomain">
                          Mtb drug binding domain
                        </label>
                        <InputText
                          id="mtbDrugBindingDomain"
                          value={values.mtbDrugBindingDomain}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <div className="field flex items-center gap-3">
                        <div
                          className="border-1 border-50 text-lg m-2 pl-2 pr-2 flex align-items-center justify-content-center text-lg"
                          htmlFor="mammalianOffTarget"
                        >
                          Data Source : ApconiX
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field flex items-center gap-3 w-full"></div>
                </form>
              )}
            </Formik>
          </div>
        </Fieldset>
      </div>

      <div className="flex w-full">
        <Fieldset className="m-0 w-full" legend="Risk Matrix">
          <div className="flex w-full gap-2">
            <div className="flex p-2 text-lg">
              <FTVApconixGrid />
            </div>
            <div className="flex align-items-top justify-content-end text-lg">
              <FTVApconixLegend />
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
};

export default observer(FTVApconix);
