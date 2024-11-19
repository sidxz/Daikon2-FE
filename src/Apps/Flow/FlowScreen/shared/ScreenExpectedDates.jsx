import { observer } from "mobx-react-lite";
import { BlockUI } from "primereact/blockui";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog } from "primereact/confirmdialog";
import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../../../RootStore";

const ScreenExpectedDates = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateScreen, selectedScreen, isUpdatingScreen } =
    rootStore.screenStore;

  // Parse date, treating "0001-01-01" or similar values as unset (null)
  const parseDateOrDefault = (dateString) => {
    return dateString &&
      dateString !== "0001-01-01T00:00:00" &&
      dateString !== "0001-01-01T00:00:00Z" &&
      dateString !== "0001-01-01T00:00:00+00:00" &&
      dateString !== "0001-01-01T00:00:00.0000000" &&
      dateString !== "0001-01-01T00:00:00.0000000Z" &&
      dateString !== ""
      ? new Date(dateString)
      : null;
  };

  const [expectedStartDate, setExpectedStartDate] = useState(
    parseDateOrDefault(selectedScreen?.expectedStartDate)
  );
  const [expectedEndDate, setExpectedEndDate] = useState(
    parseDateOrDefault(selectedScreen?.expectedCompleteDate)
  );

  const [tempStartDate, setTempStartDate] = useState(expectedStartDate);
  const [tempEndDate, setTempEndDate] = useState(expectedEndDate);

  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [dateType, setDateType] = useState("");

  const handleDateChange = (type, value) => {
    setDateType(type);
    setPendingDate(value ? new Date(value) : null); // Set the pending date for confirmation dialog
    setIsConfirmDialogVisible(true);

    // Update the temporary calendar display state
    if (type === "start") {
      setTempStartDate(value);
    } else if (type === "end") {
      setTempEndDate(value);
    }
  };

  const confirmDateChange = () => {
    if (!pendingDate) return;

    if (dateType === "start") {
      setExpectedStartDate(pendingDate);
      updateScreen({ ...selectedScreen, expectedStartDate: pendingDate });
    } else if (dateType === "end") {
      setExpectedEndDate(pendingDate);
      updateScreen({ ...selectedScreen, expectedCompleteDate: pendingDate });
    }

    resetConfirmationState();
  };

  const resetConfirmationState = () => {
    setIsConfirmDialogVisible(false);
    setPendingDate(null);
    setDateType("");

    // Reset the temporary calendar display to actual values on cancel
    setTempStartDate(expectedStartDate);
    setTempEndDate(expectedEndDate);
  };

  if (selectedScreen?.status === "Completed") return null;

  return (
    <BlockUI blocked={isUpdatingScreen}>
      <div className="flex p-1 gap-3">
        {(selectedScreen?.status === "Planned" ||
          selectedScreen?.status === "Assay Development") && (
          <div className="flex align-items-center">
            <label className="pr-2">Expected Start</label>
            <Calendar
              value={tempStartDate instanceof Date ? tempStartDate : null}
              onChange={(e) => handleDateChange("start", e.value)}
              view="month"
              dateFormat="MM / yy"
              readOnlyInput
            />
          </div>
        )}

        <div className="flex align-items-center">
          <label className="pr-2">Expected Completion</label>
          <Calendar
            value={tempEndDate instanceof Date ? tempEndDate : null}
            onChange={(e) => handleDateChange("end", e.value)}
            view="month"
            dateFormat="MM / yy"
            readOnlyInput
          />
        </div>
      </div>

      <ConfirmDialog
        visible={isConfirmDialogVisible}
        onHide={resetConfirmationState}
        message={`Are you sure you want to set the ${
          dateType === "start"
            ? "Expected Start Date"
            : "Expected Completion Date"
        } to ${pendingDate?.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        })}?`}
        header="Date Change Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={confirmDateChange}
        reject={resetConfirmationState}
      />
    </BlockUI>
  );
};

export default observer(ScreenExpectedDates);
