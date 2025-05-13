import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../RootStore";
import { AppUserResolver } from "../../Shared/VariableResolvers/AppUserResolver";

const TableCustomization = ({
  visible,
  onHide,
  tableType,
  tableInstanceId,
  allColumns,
  headerLabel = "Table Customization",
}) => {
  const rootStore = useContext(RootStoreContext);
  const { getIdFromUserFullName, getUserFullNameById } = AppUserResolver();

  const {
    getCustomization,
    isFetchingTableCustomization,
    setCustomizationUser,
    setCustomizationGlobal,
    removeUserCustomization,
    isSavingUser,
    isSavingGlobal,
    selectedTableCustomization,
  } = rootStore.tableCustomizationStore;

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (
      !selectedTableCustomization ||
      selectedTableCustomization.tableInstanceId !== tableInstanceId
    ) {
      getCustomization(tableType, tableInstanceId);
    }
  }, [tableType, tableInstanceId, getCustomization]);

  useEffect(() => {
    if (Array.isArray(selectedTableCustomization.columns)) {
      setSelectedCategories(selectedTableCustomization.columns);
    }
  }, [selectedTableCustomization]);

  const columnCheckBoxes = allColumns.map((columnName) => {
    return (
      <div key={columnName} className="flex align-items-center">
        <Checkbox
          inputId={columnName}
          name="category"
          value={columnName}
          className="m-1"
          onChange={(e) => {
            const value = e.value;
            const checked = e.checked;
            setSelectedCategories((prev) =>
              checked ? [...prev, value] : prev.filter((v) => v !== value)
            );
          }}
          checked={selectedCategories.includes(columnName)}
        />
        <label htmlFor={columnName} className="ml-2">
          {columnName}
        </label>
      </div>
    );
  });

  return (
    <Dialog
      visible={visible}
      onHide={() => onHide()}
      header={headerLabel}
      style={{ width: "70vw" }}
    >
      {isFetchingTableCustomization ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="flex flex-column">
          <div className="flex flex-wrap flex-column mb-2">
            View: {selectedTableCustomization?.level}
            {selectedTableCustomization?.level === "Global"
              ? "|  Set by " +
                getUserFullNameById(selectedTableCustomization?.userId)
              : ""}
            <Divider />
          </div>
          <div
            className="flex flex-wrap flex-column gap-1"
            style={{ maxHeight: "200px" }}
          >
            {columnCheckBoxes}
          </div>
          <div className="flex justify-content-end mt-5 gap-2">
            <Button
              type="button"
              label="Set as Default for Everyone"
              className="p-button p-component p-button-outlined"
              loading={isSavingGlobal}
              onClick={() =>
                setCustomizationGlobal({
                  tableType,
                  tableInstanceId,
                  columns: selectedCategories,
                }) && onHide()
              }
            />
            <Button
              type="button"
              label="Save My View"
              className="p-button p-component p-button-outlined"
              loading={isSavingUser}
              onClick={() =>
                setCustomizationUser({
                  tableType,
                  tableInstanceId,
                  columns: selectedCategories,
                }) && onHide()
              }
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default observer(TableCustomization);
