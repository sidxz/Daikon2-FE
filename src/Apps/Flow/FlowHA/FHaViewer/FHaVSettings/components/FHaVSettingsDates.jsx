import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBlockUI from "../../../../../../Library/LoadingBlockUI/LoadingBlockUI";
import { RootStoreContext } from "../../../../../../RootStore";
import { DateInit } from "../../../../../../Shared/DateLib/DateInit";

const FHaVSettingsDates = ({}) => {
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
    updatedHa.haPredictedStartDate = DateInit(updatedHa.haPredictedStartDate);
    updatedHa.haStartDate = DateInit(updatedHa.haStartDate);
    updatedHa.h2LPredictedStartDate = DateInit(updatedHa.h2LPredictedStartDate);

    //console.log("updatedHa", updatedHa);
    updateHa(updatedHa);
  };

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500">
      <div className="card w-full p-3">
        <LoadingBlockUI blocked={isUpdatingHa}>
          <Formik
            initialValues={{
              haPredictedStartDate: DateInit(selectedHa?.haPredictedStartDate),
              haStartDate: DateInit(selectedHa?.haStartDate),
              h2LPredictedStartDate: DateInit(
                selectedHa?.h2LPredictedStartDate
              ),
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
                      <label htmlFor="haPredictedStartDate">
                        HA Predicted Start Date
                      </label>
                      <Calendar
                        id="haPredictedStartDate"
                        name="haPredictedStartDate"
                        value={values?.haPredictedStartDate}
                        viewDate={values.haPredictedStartDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="haPredictedStartDate">
                        HA Start Date
                      </label>
                      <Calendar
                        id="haStartDate"
                        name="haStartDate"
                        value={values?.haStartDate}
                        viewDate={values.haStartDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="h2LPredictedStartDate">
                        H2L Predicted Start Date
                      </label>
                      <Calendar
                        id="h2LPredictedStartDate"
                        name="h2LPredictedStartDate"
                        value={values?.h2LPredictedStartDate}
                        viewDate={values.h2LPredictedStartDate}
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
                        loading={isUpdatingHa}
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

export default observer(FHaVSettingsDates);
