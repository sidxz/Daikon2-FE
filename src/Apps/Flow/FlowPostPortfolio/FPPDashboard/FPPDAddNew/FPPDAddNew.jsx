import { useFormik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useState } from "react";
import PleaseWait from "../../../../../Library/PleaseWait/PleaseWait";
import { RootStoreContext } from "../../../../../RootStore";
import InputOrg from "../../../../../Shared/InputEditors/InputOrg";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { stagePostPortfolioOptions } from "../../constants/stageOptions";

const FPPDAddNew = ({ closeSideBar }) => {
  const rootStore = useContext(RootStoreContext);

  const {
    addProject,
    isAddingProject,
    fetchProjects,
    projectList,
    isProjectListCacheValid,
    isFetchingProjects,
  } = rootStore.projectStore;

  useEffect(() => {
    if (!isProjectListCacheValid) {
      fetchProjects();
    }
  }, [isProjectListCacheValid]);

  const [selectedProject, setSelectedProject] = useState();

  const { getOrgNameById } = AppOrgResolver();

  const availableProjects = projectList.filter(
    (portfolio) =>
      !projectList.some((project) => project.portfolioId === portfolio.id)
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      alias: "",
      legacyId: "",
      description: "",
      stage: "IND",
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
      newProject.primaryOrgName = getOrgNameById(newProject.primaryOrgId);

      newProject.projectId = selectedProject.id;
      newProject.compoundId = selectedProject.compoundEvoLatestMoleculeId;
      newProject.compoundSMILES = selectedProject.compoundEvoLatestSMILES;
      newProject.hitCompoundId = selectedProject.compoundId;
      newProject.hitId = selectedProject.hitId;
      console.log(newProject);

      addProject(newProject).then(() => {
        closeSideBar();
        formik.resetForm();
      });
    },
  });

  useEffect(() => {
    if (selectedProject) {
      formik.setFieldValue("name", selectedProject.name);
      formik.setFieldValue("primaryOrgId", selectedProject?.primaryOrgId);
      formik.setFieldValue("alias", selectedProject?.alias);
      formik.setFieldValue("legacyId", selectedProject?.legacyId);
    }
  }, [selectedProject]);

  // Helper functions for form validation and error messages
  const isInvalid = (field) => formik.touched[field] && formik.errors[field];
  const getErrorMessage = (field) =>
    isInvalid(field) && (
      <small className="p-error">{formik.errors[field]}</small>
    );

  if (isFetchingProjects) {
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
        <label htmlFor="project">Select Project</label>
        <Dropdown
          id="project"
          value={selectedProject}
          options={availableProjects}
          onChange={(e) => {
            setSelectedProject(e.value);
          }}
          placeholder="Select Project"
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
              A name suggestion has been made based on the selected Project.
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
            options={stagePostPortfolioOptions}
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
          icon="icon icon-common icon-database-submit"
          type="submit"
          label="Create Post Portfolio Project"
          className="p-mt-2"
          loading={isAddingProject}
        />
      </form>
    </div>
  );
};

export default observer(FPPDAddNew);
