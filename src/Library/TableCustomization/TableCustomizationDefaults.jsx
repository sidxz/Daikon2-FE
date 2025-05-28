import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../RootStore";

const TableCustomizationDefaults = ({
  tableType,
  allColumns,
  headerLabel = "Table Customization",
}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    getTableDefaults,
    setTableDefaults,
    isFetchingTableDefaults,
    isSavingTableDefaults,
    selectedTableDefaults,
  } = rootStore.tableCustomizationStore;

  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (tableType && selectedTableDefaults?.tableType !== tableType) {
      getTableDefaults(tableType);
    }
  }, [tableType]);

  useEffect(() => {
    if (selectedTableDefaults && Array.isArray(selectedTableDefaults.columns)) {
      setSelectedCategories(selectedTableDefaults.columns);
    }
  }, [selectedTableDefaults]);

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
    <div>
      {isFetchingTableDefaults ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="flex flex-column">
          <div
            className="flex flex-wrap flex-column"
            style={{ maxHeight: "200px" }}
          >
            {columnCheckBoxes}
          </div>
          <div className="flex justify-content-end mt-3 gap-2">
            <Button
              type="button"
              label="Set Defaults"
              className="p-button p-component p-button-outlined"
              loading={isSavingTableDefaults}
              onClick={() =>
                setTableDefaults({
                  tableType,
                  columns: selectedCategories,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(TableCustomizationDefaults);
