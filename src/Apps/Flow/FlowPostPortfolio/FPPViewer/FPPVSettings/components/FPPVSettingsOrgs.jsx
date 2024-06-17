import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import InputMultiOrg from "../../../../../../Shared/InputEditors/InputMultiOrg";
import InputOrg from "../../../../../../Shared/InputEditors/InputOrg";

const FPPVSettingsOrgs = ({}) => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchProject,
    selectedProject,
    isFetchingProject,
    isProjectRegistryCacheValid,
    updateProject,
    isUpdatingProject,
  } = rootStore.projectStore;

  const { appVars } = rootStore.authStore;
  if (isFetchingProject) {
    return <Loading message={"Fetching Project..."} />;
  }

  const onFormikSubmit = (data) => {
    const updatedProject = { ...selectedProject, ...data };
    //console.log("updatedProject", updatedProject);
    // keep only the ids of the participating orgs if they are available in appVars.orgs
    updatedProject.participatingOrgs = updatedProject.participatingOrgs.filter(
      (orgId) => appVars.orgs[orgId]
    );
    updateProject(updatedProject);
  };

  return (
    <div className="flex min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingProject}>
          <Formik
            initialValues={{
              primaryOrgId: selectedProject?.primaryOrgId,
              participatingOrgs: selectedProject?.participatingOrgs,
            }}
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
                <div className="flex flex-column">
                  <div className="field">
                    <label htmlFor="primaryOrgId">Primary Organization</label>
                    <InputOrg
                      id="primaryOrgId"
                      value={values.primaryOrgId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="primaryOrgId">
                      Participating Organization
                    </label>
                    <InputMultiOrg
                      id="participatingOrgs"
                      value={values.participatingOrgs}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="field">
                    <Button
                      icon="icon icon-common icon-database-submit"
                      type="submit"
                      label="Save Changes"
                      className="p-button-secondary w-12rem"
                      loading={isUpdatingProject}
                    />
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

export default observer(FPPVSettingsOrgs);
