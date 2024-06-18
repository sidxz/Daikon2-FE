import { Formik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../../Library/Loading/Loading";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import { DateInit } from "../../../../../../Shared/DateLib/DateInit";

const FPPVSettingsDates = ({}) => {
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

    updatedProject.indPredictedStart = DateInit(
      updatedProject.indPredictedStart
    );
    updatedProject.indStart = DateInit(updatedProject.indStart);
    updatedProject.p1PredictedStart = DateInit(updatedProject.p1PredictedStart);
    updatedProject.p1Start = DateInit(updatedProject.p1Start);

    //console.log("updatedProject", updatedProject);
    updateProject(updatedProject);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingProject}>
          <Formik
            initialValues={{
              indPredictedStart: DateInit(selectedProject?.indPredictedStart),
              indStart: DateInit(selectedProject?.indStart),
              p1PredictedStart: DateInit(selectedProject?.p1PredictedStart),
              p1Start: DateInit(selectedProject?.p1Start),
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
                  <div className="flex gap-3">
                    <div className="field">
                      <label htmlFor="indPredictedStart">
                        IND Predicted Start Date
                      </label>
                      <Calendar
                        id="indPredictedStart"
                        name="indPredictedStart"
                        value={values?.indPredictedStart}
                        viewDate={values.indPredictedStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="indStart">IND Start Date</label>
                      <Calendar
                        id="indStart"
                        name="indStart"
                        value={values?.indStart}
                        viewDate={values.indStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="p1PredictedStart">
                        P1 Predicted Start Date
                      </label>
                      <Calendar
                        id="p1PredictedStart"
                        name="p1PredictedStart"
                        value={values?.p1PredictedStart}
                        viewDate={values.p1PredictedStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="p1Start">P1 Start Date</label>
                      <Calendar
                        id="p1Start"
                        name="p1Start"
                        value={values?.p1Start}
                        viewDate={values.p1Start}
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

export default FPPVSettingsDates;
