import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../../../Library/Loading/Loading";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import { DateInit } from "../../../../../../Shared/DateLib/DateInit";

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

  console.log("selectedProject", selectedProject);

  const onFormikSubmit = (data) => {
    console.log("data", data);
    const updatedProject = { ...selectedProject, ...data };
    updateProject.h2LPredictedStart = DateInit(
      updatedProject.h2LPredictedStart
    );
    updateProject.h2LStart = DateInit(updatedProject.h2LStart);
    updateProject.loPredictedStart = DateInit(updatedProject.loPredictedStart);
    updateProject.loStart = DateInit(updatedProject.loStart);
    updateProject.spPredictedStart = DateInit(updatedProject.spPredictedStart);
    updateProject.spStart = DateInit(updatedProject.spStart);
    updateProject.indPredictedStart = DateInit(
      updatedProject.indPredictedStart
    );
    updateProject.indStart = DateInit(updatedProject.indStart);
    updateProject.p1PredictedStart = DateInit(updatedProject.p1PredictedStart);
    updateProject.p1Start = DateInit(updatedProject.p1Start);
    console.log("updatedProject", updatedProject);
    updateProject(updatedProject);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingProject}>
          <Formik
            initialValues={{
              h2LPredictedStart: DateInit(selectedProject?.h2LPredictedStart),
              h2LStart: DateInit(selectedProject?.h2LStart),
              loPredictedStart: DateInit(selectedProject?.loPredictedStart),
              loStart: DateInit(selectedProject?.loStart),
              spPredictedStart: DateInit(selectedProject?.spPredictedStart),
              spStart: DateInit(selectedProject?.spStart),
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
              <form
                onSubmit={handleSubmit}
                className="p-fluid"
                onKeyDown={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
              >
                <div className="flex flex-column">
                  <div className="flex gap-2">
                    <div className="field">
                      <label htmlFor="h2LPredictedStart">
                        H2L Predicted Start Date
                      </label>
                      <Calendar
                        id="h2LPredictedStart"
                        name="h2LPredictedStart"
                        value={values?.h2LPredictedStart}
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
                        value={values?.h2LStart}
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
                        value={values?.loPredictedStart}
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
                        value={values?.loStart}
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
                        value={values?.spPredictedStart}
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
                        value={values?.spStart}
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
