import { Dropdown } from "primereact/dropdown";
import { NavLink } from "react-router-dom";

export const accessionNumberBodyTemplate = (rowData) => {
  return (
    <>
      <NavLink to={"/wf/gene/" + rowData.id}>{rowData.accessionNumber}</NavLink>
    </>
  );
};

const functionalCategoryItemTemplate = (option) => {
  return <>{option}</>;
};

export const functionalCategoryFilter = (options, geneFunctionalCategories) => (
  <Dropdown
    value={options.value}
    options={Array.from(geneFunctionalCategories)}
    onChange={(e) => options.filterApplyCallback(e.value)}
    itemTemplate={functionalCategoryItemTemplate}
    placeholder="Select a Category"
    className="p-column-filter"
    showClear
  />
);
