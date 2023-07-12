import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PleaseWait from "../../../../../app/common/PleaseWait/PleaseWait";
import SectionHeading from "../../../../../app/common/SectionHeading/SectionHeading";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { appColors } from "../../../../../colors";

const ScreenPhenotypicEdit = ({ screenId }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const { appVars } = rootStore.generalStore;
  const { fetchOrgs, Orgs } = rootStore.adminStore;
  const { loadingFetchScreen, fetchScreen, selectedScreen } =
    rootStore.screenStore;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("PhenotypicScreenSequence.js: useEffect screenId: ", screenId);
    if (selectedScreen === null || selectedScreen.id !== screenId) {
      fetchScreen(screenId);
    }
    if (Orgs.length === 0) {
      fetchOrgs();
    }
  }, [selectedScreen, fetchScreen, screenId, fetchOrgs, Orgs]);

  if (loadingFetchScreen || selectedScreen === null) {
    return <PleaseWait />;
  }

  console.log("ScreenPhenotypicEdit.js: selectedScreen: ", selectedScreen);

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: selectedScreen.screenName,
      command: () => {
        // navigate(`/d/gene/${gene.id}`);
      },
    },
  ];

  return (
    <div className="flex flex-column w-full">
      <div className="flex w-full pb-2">
        <BreadCrumb model={breadCrumbItems} />
      </div>
      <div className="flex w-full">
        <SectionHeading
          icon="icon icon-common icon-search"
          heading={"Screens " + selectedScreen.screenName}
          entryPoint={selectedScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full m-2 p-2">
        <Formik
          initialValues={{
            screenName: selectedScreen.screenName,
            method: selectedScreen.method,
            org: selectedScreen.org,
            promotionDate: new Date(selectedScreen.promotionDate),
          }}
          validate={(values) => {
            const errors = {};
            if (!values.screenName) {
              errors.screenName = "Screen Name is required";
            }
            if (!values.method) {
              errors.method = "Method is required";
            }
            if (!values.org) {
              errors.org = "Organization is required";
            }
            if (!values.promotionDate) {
              errors.promotionDate = "Promotion Date is required";
            }
            return errors;
          }}
          onSubmit={(values) => {
            console.log("ScreenPhenotypicEdit.js: onSubmit: values: ", values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="flex flex-column gap-1">
                <div className="flex flex-column w-full">
                  <div className="field">
                    <label htmlFor="screenName">Screen Name</label>
                    <InputText
                      id="screenName"
                      value={values.screenName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoFocus
                      className={
                        errors.screenName && touched.screenName
                          ? "p-invalid block"
                          : ""
                      }
                    />
                    {errors.screenName &&
                      touched.screenName &&
                      errors.screenName}
                  </div>
                </div>

                <div className="flex flex-column w-full">
                  <div className="field">
                    <label htmlFor="method">Method</label>
                    <Dropdown
                      id="method"
                      answer="method"
                      options={appVars?.screeningMethods}
                      value={values.method}
                      placeholder="Select a method"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.method && touched.method && errors.method}
                  </div>
                </div>

                <div className="flex flex-column w-full">
                  <div className="field">
                    <label htmlFor="org">Organization </label>
                    <Dropdown
                      id="org"
                      value={values.org}
                      options={Orgs}
                      optionLabel="name"
                      placeholder="Select an org"
                      filter
                      showClear
                      filterBy="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.org && touched.org && errors.org}
                  </div>
                </div>

                <div className="flex flex-column w-full">
                  <div className="field">
                    <label htmlFor="promotionDate">Promotion Date</label>
                    <Calendar
                      id="promotionDate"
                      name="promotionDate"
                      value={values.promotionDate}
                      dateFormat="dd/mm/yy"
                      mask="99/99/9999"
                      showIcon
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.promotionDate &&
                      touched.promotionDate &&
                      errors.promotionDate}
                  </div>
                </div>

                <div className="flex flex-column w-full">
                  <div className="field">
                    <Button
                      label="Save"
                      className="p-button-success"
                      type="submit"
                      // onClick={() => handleSubmit()}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default observer(ScreenPhenotypicEdit);
