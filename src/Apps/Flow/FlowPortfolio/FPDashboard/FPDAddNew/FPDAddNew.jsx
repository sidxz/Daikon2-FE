import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { confirmPopup } from "primereact/confirmpopup";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { stagePortfolioOptions } from "../../constants/stageOptions";

const FPDAddNew = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);
  const { fetchHAs, isHaListCacheValid, isFetchingHAs, haPortfolioReadyList } =
    rootStore.haStore;

  const {
    addProject,
    isAddingProject,
    fetchProjects,
    isProjectListCacheValid,
    projectList,
    isFetchingProjects,
  } = rootStore.projectStore;

  const submitButtonEl = useRef(null);

  useEffect(() => {
    if (!isHaListCacheValid) {
      fetchHAs();
    }
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isHaListCacheValid, isProjectListCacheValid]);

  const [selectedHa, setSelectedHa] = useState();
  const { getOrgNameById } = AppOrgResolver();

  // available has are haPortfolioReadyList minus the ones that are already projects

  const availableHAs = haPortfolioReadyList.filter(
    (ha) => !projectList.some((project) => project.haId === ha.id)
  );
  console.log("availableHAs", availableHAs);

  const formik = useFormik({
    initialValues: {
      name: "",
      alias: "",
      legacyId: "",
      description: "",
      stage: "H2L",
      primaryOrgId: "",
      primaryOrgName: "",
      participatingOrgs: [],
    },

    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required.";
      if (!values.primaryOrgId)
        errors.primaryOrgId = "Organization is required.";
      // Additional validations can be added here
      return errors;
    },

    onSubmit: (newProject) => {
      console.log(selectedHa);
      console.log("newProject", newProject);

      const submitFunc = () => {
        console.log("submitFunc");
        newProject.primaryOrgName = getOrgNameById(newProject.primaryOrgId);

        if (newProject.selectedHa !== undefined) {
          newProject.haId = selectedHa.id;
          newProject.compoundId = selectedHa.compoundEvoLatestMoleculeId;
          newProject.compoundSMILES = selectedHa.compoundEvoLatestSMILES;
          newProject.hitCompoundId = selectedHa.compoundId;
          newProject.hitId = selectedHa.hitId;
        }

        console.log(newProject);

        addProject(newProject).then(() => {
          closeSideBar();
          formik.resetForm();
        });
      };

      if (selectedHa === undefined) {
        console.log("No HA selected");

        const reject = () => {
          return;
        };

        confirmPopup({
          target: submitButtonEl.current,
          message: (
            <div>
              A Hit Assessment has <b>not</b> been selected. <br />
              This would create a <b>detached project.</b>
              <br />
              Are you sure you want to proceed?
            </div>
          ),
          icon: "pi pi-exclamation-triangle",
          accept: submitFunc,
          reject: reject,
        });
      } else {
        submitFunc();
      }
    },
  });

  useEffect(() => {
    if (selectedHa) {
      formik.setFieldValue("name", selectedHa.name);
      formik.setFieldValue("primaryOrgId", selectedHa?.primaryOrgId);
      formik.setFieldValue("alias", selectedHa?.alias);
      formik.setFieldValue("legacyId", selectedHa?.legacyId);
    }
  }, [selectedHa]);

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingHAs || isFetchingProjects) {
    return <PleaseWait />;
  }

  // Template for rendering a selected stage option
  const stageOptionTemplate = (option) => {
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  const stageValueTemplate = (option) => {
    if (option === null) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">
            <FcExpired />
          </div>
          <div className="flex flex-column">Stage Not Set</div>
        </div>
      );
    }
    if (option) {
      return (
        <div className="flex align-items-center align-self-center gap-2">
          <div className="flex flex-column">{option.icon}</div>
          <div className="flex flex-column">{option.name}</div>
        </div>
      );
    }
  };

  return (
    <div className="card w-full">
      <div className="field p-fluid">
        <label htmlFor="ha">Select HA</label>
        <Dropdown
          id="ha"
          value={selectedHa}
          options={availableHAs}
          onChange={(e) => {
            setSelectedHa(e.value);
          }}
          placeholder="Select HA"
          optionLabel="name"
          autoFocus
          className="text-base text-color surface-overlay"
        />
      </div>
      <form onSubmit={formik.handleSubmit} className="p-fluid">
        <div className="field">
          <label
            htmlFor="name"
            className={classNames({
              "p-error": isInvalid("name"),
            })}
          >
            Name *
            <p className="text-xs text-color">
              A name suggestion has been made based on the selected HA project.
            </p>
          </label>
          <InputText
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("name"),
            })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="alias"
            className={classNames({
              "p-error": isInvalid("alias"),
            })}
          >
            Alias
          </label>
          <InputText
            id="alias"
            value={formik.values.alias}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("alias"),
            })}
          />
        </div>

        <div className="field">
          <label
            htmlFor="primaryOrgId"
            className={classNames({
              "p-error": isInvalid("primaryOrgId"),
            })}
          >
            Primary Organization
          </label>

          <InputOrg
            value={formik.values.primaryOrgId}
            onChange={formik.handleChange("primaryOrgId")}
            className={classNames({
              "p-invalid": isInvalid("primaryOrgId"),
            })}
          />
          {getErrorMessage("primaryOrgId")}
        </div>

        <div className="field">
          <label
            htmlFor="stage"
            className={classNames({
              "p-error": isInvalid("stage"),
            })}
          >
            Stage
          </label>
          <Dropdown
            id="stage"
            optionLabel="name"
            optionValue="value"
            options={stagePortfolioOptions}
            itemTemplate={stageOptionTemplate}
            valueTemplate={stageValueTemplate}
            value={formik.values.stage}
            placeholder="Select a stage"
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("stage"),
            })}
          />

          {getErrorMessage("stage")}
        </div>

        <div className="field">
          <label
            htmlFor="description"
            className={classNames({
              "p-error": isInvalid("description"),
            })}
          >
            Description
          </label>
          <InputTextarea
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            className={classNames({
              "p-invalid": isInvalid("description"),
            })}
          />
        </div>

        <Button
          ref={submitButtonEl}
          icon="icon icon-common icon-database-submit"
          type="submit"
          label="Create Portfolio Project"
          className="p-mt-2"
          loading={isAddingProject}
        />
      </form>
    </div>
  );
};

export default observer(FPDAddNew);
