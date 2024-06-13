import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import InputMultiOrg from "../../../../../../Shared/InputEditors/InputMultiOrg";
import InputOrg from "../../../../../../Shared/InputEditors/InputOrg";

const FHaVSettingsOrgs = ({}) => {
  const navigate = useNavigate();
  const rootStore = useContext(RootStoreContext);
  const {
    fetchHa,
    selectedHa,
    isFetchingHa,
    isUpdatingHa,
    updateHa,
    isHaRegistryCacheValid,
  } = rootStore.haStore;

  const { appVars } = rootStore.authStore;
  if (isFetchingHa) {
    return <Loading message={"Fetching Ha..."} />;
  }

  const onFormikSubmit = (data) => {
    const updatedHa = { ...selectedHa, ...data };

    // keep only the ids of the participating orgs if they are available in appVars.orgs
    updatedHa.participatingOrgs = updatedHa.participatingOrgs.filter(
      (orgId) => appVars.orgs[orgId]
    );

    updateHa(updatedHa);
  };

  return (
    <div className="flex min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingHa}>
          <Formik
            initialValues={{
              primaryOrgId: selectedHa?.primaryOrgId,
              participatingOrgs: selectedHa?.participatingOrgs,
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
                      loading={isUpdatingHa}
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

export default observer(FHaVSettingsOrgs);
