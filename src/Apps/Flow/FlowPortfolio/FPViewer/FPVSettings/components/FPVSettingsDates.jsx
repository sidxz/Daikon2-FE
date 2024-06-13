import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../../Library/Loading/Loading";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";

const FPVSettingsDates = ({}) => {
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

  if (isFetchingProject) {
    return <Loading message={"Fetching Project..."} />;
  }

  const onFormikSubmit = (data) => {
    const updatedProject = { ...selectedProject, ...data };
    console.log("updatedProject", updatedProject);
    updateProject(updatedProject);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingProject}>
          <Formik
            initialValues={{
              h2LPredictedStart: selectedProject?.h2LPredictedStart,
              h2LStart: selectedProject?.h2LStart,
              loPredictedStart: selectedProject?.loPredictedStart,
              loStart: selectedProject?.loStart,
              spPredictedStart: selectedProject?.spPredictedStart,
              spStart: selectedProject?.spStart,
              indPredictedStart: selectedProject?.indPredictedStart,
              indStart: selectedProject?.indStart,
              p1PredictedStart: selectedProject?.p1PredictedStart,
              p1Start: selectedProject?.p1Start,
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
                  <div className="flex gap-2">
                    <div className="field">
                      <label htmlFor="h2LPredictedStart">
                        H2L Predicted Start Date
                      </label>
                      <Calendar
                        id="h2LPredictedStart"
                        name="h2LPredictedStart"
                        value={new Date(values?.h2LPredictedStart)}
                        viewDate={values.h2LPredictedStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="h2LStart">H2L Start Date</label>
                      <Calendar
                        id="h2LStart"
                        name="h2LStart"
                        value={new Date(values?.h2LStart)}
                        viewDate={values.h2LStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="loPredictedStart">
                        LO Predicted Start Date
                      </label>
                      <Calendar
                        id="loPredictedStart"
                        name="loPredictedStart"
                        value={new Date(values?.loPredictedStart)}
                        viewDate={values.loPredictedStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="loStart">LO Start Date</label>
                      <Calendar
                        id="loStart"
                        name="loStart"
                        value={new Date(values?.loStart)}
                        viewDate={values.loStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="spPredictedStart">
                        SP Predicted Start Date
                      </label>
                      <Calendar
                        id="spPredictedStart"
                        name="spPredictedStart"
                        value={new Date(values?.spPredictedStart)}
                        viewDate={values.spPredictedStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="spStart">SP Start Date</label>
                      <Calendar
                        id="spStart"
                        name="spStart"
                        value={new Date(values?.spStart)}
                        viewDate={values.spStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="submit" className="text-white-alpha-10">
                        -
                      </label>
                      <Button
                        icon="icon icon-common icon-database-submit"
                        type="submit"
                        label="Save Changes"
                        className="p-button-secondary"
                        loading={isUpdatingProject}
                      />
                    </div>
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

export default observer(FPVSettingsDates);
