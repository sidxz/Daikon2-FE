import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
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
  const {
    isLoadingPhenotypicScreen,
    fetchPhenotypicScreen,
    selectedPhenotypicScreen,
    updatePhenotypicScreen,
    isUpdatingPhenotypicScreen,
  } = rootStore.screenPStore;

  const navigate = useNavigate();

  // Fetch the phenotypic screen data on component mount or when screenId changes
  useEffect(() => {
    if (
      selectedPhenotypicScreen === null ||
      selectedPhenotypicScreen.id !== screenId
    ) {
      fetchPhenotypicScreen(screenId);
    }
    if (Orgs.length === 0) fetchOrgs();
  }, [
    selectedPhenotypicScreen,
    fetchPhenotypicScreen,
    screenId,
    Orgs,
    fetchOrgs,
  ]);

  // Display a loading message while data is being fetched
  if (isLoadingPhenotypicScreen || selectedPhenotypicScreen === null) {
    return <PleaseWait />;
  }

  console.log(
    "ScreenPhenotypicEdit.js: selectedPhenotypicScreen: ",
    selectedPhenotypicScreen
  );

  const breadCrumbItems = [
    {
      label: "Screens",
      command: () => {
        navigate("/d/screen/");
      },
    },
    {
      label: selectedPhenotypicScreen.screenName,
      command: () => {
        navigate("/d/screen/phenotypic/" + selectedPhenotypicScreen.id);
      },
    },
    {
      label: "Edit",
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
          heading={
            "Screens " + selectedPhenotypicScreen.screenName + " [ Edit ]"
          }
          entryPoint={selectedPhenotypicScreen.screenName}
          displayHorizon={true}
          color={appColors.sectionHeadingBg.screen}
        />
      </div>

      <div className="flex w-full m-2 p-2">
        <Formik
          initialValues={{
            screenName: selectedPhenotypicScreen.screenName,
            method: selectedPhenotypicScreen.method,
            org: selectedPhenotypicScreen.org,
            promotionDate: new Date(selectedPhenotypicScreen.promotionDate),
            statusDate: selectedPhenotypicScreen.statusDate
              ? new Date(selectedPhenotypicScreen.statusDate)
              : null,
            notes: selectedPhenotypicScreen.notes,
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
              errors.promotionDate = "Creation Date is required";
            }
            return errors;
          }}
          onSubmit={(updatedScreen) => {
            updatedScreen.id = selectedPhenotypicScreen.id;
            updatedScreen.orgId = updatedScreen.org.id;
            // console.log(
            //   "ScreenPhenotypicEdit.js: onSubmit: values: ",
            //   updatedScreen
            // );
            updatePhenotypicScreen(updatedScreen);
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
                    <label htmlFor="promotionDate">Creation Date</label>
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
                    <label htmlFor="statusDate">
                      Last Status Date (Override)
                    </label>
                    <Calendar
                      id="statusDate"
                      name="statusDate"
                      value={values.statusDate}
                      dateFormat="dd/mm/yy"
                      mask="99/99/9999"
                      showIcon
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.statusDate &&
                      touched.statusDate &&
                      errors.statusDate}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="notes">Notes</label>
                  <InputTextarea
                    id="notes"
                    answer="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.notes && touched.notes && errors.notes}
                </div>

                <div className="flex flex-column w-full">
                  <div className="field">
                    <Button
                      label="Save"
                      className="p-button-success"
                      type="submit"
                      onClick={() => handleSubmit()}
                      loading={isUpdatingPhenotypicScreen}
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
