import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { Fieldset } from "primereact/fieldset";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../../app/common/FailedLoading/FailedLoading";
import SectionHeading from "../../../../app/common/SectionHeading/SectionHeading";
import Loading from "../../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../../app/stores/rootStore";
import { appColors } from "../../../../colors";
import ProjectSettingsDates from "./LocalComponents/ProjectSettingsDates";
import ProjectSettingsDescriptions from "./LocalComponents/ProjectSettingsDescriptions";
import ProjectSettingsGeneralInformation from "./LocalComponents/ProjectSettingsGeneralInformation";
import ProjectSettingsMarkDelete from "./LocalComponents/ProjectSettingsMarkDelete";
import ProjectSettingsPriority from "./LocalComponents/ProjectSettingsPriority";
import ProjectSettingsRestore from "./LocalComponents/ProjectSettingsRestore";
import ProjectSettingsStageOverride from "./LocalComponents/ProjectSettingsStageOverride";
import ProjectSettingsTerminate from "./LocalComponents/ProjectSettingsTerminate";

const ProjectSettings = ({ id, project }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  // const { user } = rootStore.userStore;
  const { loadingProject, fetchProject, selectedProject } =
    rootStore.projectStore;

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProject === null || selectedProject.id !== id) {
      fetchProject(id);
    }
  }, [id, selectedProject, fetchProject]);

  /* Loading Overlay */
  if (loadingProject) {
    return <Loading />;
  }

  if (
    !loadingProject &&
    selectedProject !== null &&
    selectedProject.id === id
  ) {
    const breadCrumbItems = [
      {
        label: "Project Management",
        command: () => {
          navigate("/pm/");
        },
      },
      {
        label: "Projects",
        command: () => {
          navigate("/pm/project");
        },
      },
      { label: selectedProject.projectName },
    ];

    return (
      <React.Fragment>
        <div className="flex flex-column w-full">
          <div className="flex w-full pb-2">
            <BreadCrumb model={breadCrumbItems} />
          </div>

          <div className="flex w-full">
            <SectionHeading
              icon="icon icon-common icon-briefcase"
              heading={project.projectName + " | " + project?.currentStage}
              entryPoint={project.targetName}
              displayHorizon={true}
              color={appColors.sectionHeadingBg.project}
            />
          </div>

          <div className="flex w-full gap-2">
            <div className="flex flex-column gap-2">
              <div className="flex">
                <Fieldset className="w-full" legend="Project Information">
                  <ProjectSettingsGeneralInformation
                    project={selectedProject}
                  />
                </Fieldset>
              </div>
              <div className="flex">
                <Fieldset className="w-full" legend="Project Stage Override">
                  <ProjectSettingsStageOverride project={selectedProject} />
                </Fieldset>
              </div>
              <div className="flex">
                <Fieldset className="w-full" legend="Lifecycle">
                  {selectedProject?.status === "Terminated" && (
                    <ProjectSettingsRestore project={selectedProject} />
                  )}
                  {selectedProject?.status === "Active" && (
                    <ProjectSettingsTerminate project={selectedProject} />
                  )}
                </Fieldset>
              </div>
            </div>
            <div className="flex-column w-full">
              <div className="flex mb-2" style={{ width: "50rem" }}>
                <Fieldset className="w-full" legend="Project Dates">
                  <ProjectSettingsDates project={selectedProject} />
                </Fieldset>
              </div>
              <div className="flex mb-2" style={{ width: "50rem" }}>
                <Fieldset className="w-full" legend="Project Descriptions">
                  <ProjectSettingsDescriptions project={selectedProject} />
                </Fieldset>
              </div>

              <div className="flex mb-2" style={{ width: "50rem" }}>
                <Fieldset className="w-full" legend="Project Team P/P">
                  <ProjectSettingsPriority project={selectedProject} />
                </Fieldset>
              </div>
              <div className="flex mb-2" style={{ width: "50rem" }}>
                <Fieldset className="w-full" legend="Danger Zone">
                  <ProjectSettingsMarkDelete project={selectedProject} />
                </Fieldset>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return <FailedLoading />;
};

export default observer(ProjectSettings);
