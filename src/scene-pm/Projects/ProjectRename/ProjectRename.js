import { observer } from "mobx-react-lite";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FailedLoading from "../../../app/common/FailedLoading/FailedLoading";
import GeneralConfirmation from "../../../app/common/GeneralConfirmation/GeneralConfirmation";
import SectionHeading from "../../../app/common/SectionHeading/SectionHeading";
import Unauthorized from "../../../app/common/Unauthorized/Unauthorized";
import Loading from "../../../app/layout/Loading/Loading";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { appColors } from "../../../colors";

const ProjectRename = ({ id, project }) => {

    /* MobX Store */
    const rootStore = useContext(RootStoreContext);
    // const { user } = rootStore.userStore;
    const { loadingProject, fetchProject, selectedProject, renameProject, isRenamingProjectName } =
        rootStore.projectStore;

    const navigate = useNavigate();
    const toast = useRef(null);
    const { user } = rootStore.userStore;

    const [newProjectName, setNewProjectName] = useState("");

    useEffect(() => {
        if (selectedProject === null || selectedProject.id !== id) {
            fetchProject(id);
        }
    }, [id, selectedProject, fetchProject]);

    /* Loading Overlay */
    if (loadingProject || isRenamingProjectName) {
        return <Loading />;
    }
    if (!user.roles.includes("admin")) {
        return <Unauthorized />;
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


        let renameAction = () => {
            if (selectedProject === null || newProjectName === "") {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Please enter a valid project name.",
                });
                return;
            }
            console.log("Renaming Project");
            console.log(selectedProject.id, newProjectName);
            renameProject(newProjectName);
        };


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

                    <div className="flex w-full">
                        <SectionHeading
                            icon="icon icon-common icon-edit"
                            heading={"Rename Project"}
                            color={"#f4f4f4"}
                            textColor={"#000000"}
                        />
                    </div>


                    <div className="flex w-full border-1 p-2 text-lg mb-2">
                        Current Project Name: {selectedProject.projectName}
                    </div>
                    <div className="flex w-full border-1 p-2 gap-2 align-content-center mb-2">
                        <div className="flex text-lg align-items-center">
                            Updated Project Name:{" "}
                        </div>
                        <div className="flex text-lg align-items-center ">
                            <InputText
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                            />
                        </div>

                    </div>
                    <div className="flex w-full border-1 p-2 text-lg">
                        <GeneralConfirmation callBack={renameAction} />
                    </div>


                </div>
            </React.Fragment>
        );
    }

    return <FailedLoading />;
}

export default observer(ProjectRename)