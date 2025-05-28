import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";

const FHaVSettingsInformation = ({}) => {
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

  if (isFetchingHa) {
    return <Loading message={"Fetching Ha..."} />;
  }

  const onFormikSubmit = (data) => {
    const updatedHa = { ...selectedHa, ...data };
    updatedHa.description = updatedHa.description;
    //console.log("updatedHa", updatedHa);
    updateHa(updatedHa);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingHa}>
          <Formik
            initialValues={{
              description: selectedHa?.description,
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
              <form
                onSubmit={handleSubmit}
                className="p-fluid"
                onKeyDown={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
              >
                <div className="flex gap-3">
                  <div className="flex gap-4">
                    <div className="field">
                      <label htmlFor="description">HA Description</label>
                      <InputTextarea
                        id="description"
                        name="description"
                        value={values?.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        cols={100}
                      />
                    </div>
                  </div>
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
              </form>
            )}
          </Formik>
        </LoadingBlockUI>
      </div>
    </div>
  );
};

export default observer(FHaVSettingsInformation);
