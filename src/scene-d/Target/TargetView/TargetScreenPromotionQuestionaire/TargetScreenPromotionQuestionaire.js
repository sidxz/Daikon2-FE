import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../app/stores/rootStore";

/**
 * Component for the target screen promotion questionnaire.
 * @param {function} closeSidebar - Function to close the sidebar.
 */

const TargetScreenPromotionQuestionaire = ({ closeSidebar }) => {
  // Get the MobX Store instance from the context
  const rootStore = useContext(RootStoreContext);
  const {
    selectedTarget,
    promoteTargetToScreen,
    promoteTargetToScreenDisplayLoading,
  } = rootStore.targetStore;

  const { appVars } = rootStore.generalStore;
  // State to control whether to show the success message
  const [showMessage, setShowMessage] = useState(false);

  // Initialize formik hook
  const formik = useFormik({
    initialValues: {
      org: "",
      promotionDate: "",
      notes: "",
      method: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.promotionDate) {
        errors.promotionDate = "Promotion date  is required.";
      }

      if (data.method === "") {
        errors.method = "Method is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      data["targetID"] = selectedTarget.id;
      data["orgId"] = data.org.id;

      // Promote target to screen and close the sidebar on success
      promoteTargetToScreen(data).then((res) => {
        if (res !== null) {
          closeSidebar();
        }
      });
      //setShowMessage(true);
      //history.push()
      //formik.resetForm();
    },
  });

  /**
   * Checks if a form field is valid.
   * @param {string} library - The form field library.
   * @returns {boolean} - True if the form field is valid, false otherwise.
   */
  const isFormFieldValid = (library) =>
    !!(formik.touched[library] && formik.errors[library]);

  /**
   * Retrieves the error message for a form field.
   * @param {string} library - The form field library.
   * @returns {JSX.Element} - The error message element.
   */
  const getFormErrorMessage = (library) => {
    return (
      isFormFieldValid(library) && (
        <small className="p-error">{formik.errors[library]}</small>
      )
    );
  };

  if (!promoteTargetToScreenDisplayLoading) {
    return (
      <React.Fragment>
        {/* <Dialog
          visible={showMessage}
          onHide={() => setShowMessage(false)}
          position="top"
          footer={dialogFooter}
          showHeader={false}
          breakpoints={{ "960px": "80vw" }}
          style={{ width: "30vw" }}
        >
          <div className="flex p-ai-center p-dir-col p-pt-6 p-px-3">
            <i
              className="pi pi-check-circle"
              style={{ fontSize: "5rem", color: "var(--green-500)" }}
            ></i>
            <h5>Screening information has been added!</h5>
          </div>
        </Dialog> */}
        <div className="card w-full">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <label
                htmlFor="promotionDate"
                className={classNames({
                  "p-error": isFormFieldValid("promotionDate"),
                })}
              >
                Promotion Date
              </label>

              <Calendar
                id="promotionDate"
                name="promotionDate"
                value={formik.values.promotionDate}
                onChange={formik.handleChange}
                dateFormat="dd/mm/yy"
                mask="99/99/9999"
                showIcon
                className={classNames({
                  "p-invalid": isFormFieldValid("promotionDate"),
                })}
              />
              {getFormErrorMessage("promotionDate")}
            </div>
            <div className="field">
              <label
                htmlFor="org"
                className={classNames({
                  "p-error": isFormFieldValid("org"),
                })}
              >
                Screening Organization
              </label>

              <Dropdown
                value={formik.values.org}
                options={appVars.appOrgs}
                onChange={formik.handleChange("org")}
                optionLabel="name"
                placeholder="Select an org"
                filter
                showClear
                filterBy="name"
                className={classNames({
                  "p-invalid": isFormFieldValid("org"),
                })}
              />
              {getFormErrorMessage("org")}
            </div>

            <div className="field">
              <label
                htmlFor="method"
                className={classNames({
                  "p-error": isFormFieldValid("method"),
                })}
              >
                Method
              </label>
              <Dropdown
                id="method"
                answer="method"
                options={appVars?.screeningMethods}
                value={formik.values.method}
                placeholder="Select a method"
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldValid("method"),
                })}
              />

              {getFormErrorMessage("method")}
            </div>

            <div className="field">
              <label
                htmlFor="notes"
                className={classNames({
                  "p-error": isFormFieldValid("comment"),
                })}
              >
                Notes
              </label>
              <InputTextarea
                id="notes"
                answer="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                className={classNames({
                  "p-invalid": isFormFieldValid("notes"),
                })}
              />
            </div>

            <Button
              icon="icon icon-common icon-database-submit"
              type="submit"
              label="Add Screen"
              className="p-mt-2"
            />
          </form>
        </div>
      </React.Fragment>
    );
  }

  return <ProgressBar mode="indeterminate" style={{ height: "6px" }} />;
};

export default observer(TargetScreenPromotionQuestionaire);
