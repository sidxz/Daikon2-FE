import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Tree } from "primereact/tree";
import { DVariableResolver } from "../../../../Shared/DVariable/DVariableResolver";
import { AppOrgResolver } from "../../../../Shared/VariableResolvers/AppOrgResolver";
import { downloadExcel, formatMDRRowsForExport } from "./csvFormatHelper";

const MLDRSideBar = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  data,
  orgSelectionKeys,
  setOrgSelectionKeys,
  getRecentDisclosures,
}) => {
  const { getOrgAliasById } = AppOrgResolver();

  const exportFormatted = () => {
    const formatted = formatMDRRowsForExport(data, {
      DVariableResolver,
      getOrgAliasById,
    });
    const start = startDate
      ? new Date(startDate).toISOString().slice(0, 10)
      : "start";
    const end = endDate ? new Date(endDate).toISOString().slice(0, 10) : "end";
    const fileName = `Disclosure Data ${start} to ${end}.xlsx`;
    downloadExcel(formatted, fileName);
  };

  // Count disclosures per org
  const orgCounts = data.reduce((acc, item) => {
    const orgId = item.disclosureOrgId;
    if (!orgId) return acc;
    acc[orgId] = (acc[orgId] || 0) + 1;
    return acc;
  }, {});

  // Build tree nodes with counts in labels
  const orgMap = new Map();

  data.forEach((item) => {
    const orgId = item.disclosureOrgId;
    if (!orgId || orgMap.has(orgId)) return;

    const alias = getOrgAliasById(orgId) || "Unknown Org";
    const count = orgCounts[orgId] || 0;

    orgMap.set(orgId, {
      key: orgId,
      label: `${alias} (${count})`,
      icon: "pi pi-building",
    });
  });

  const orgNodes = Array.from(orgMap.values());

  const menuItems = [
    {
      key: "0",
      label: "Organizations",
      icon: "pi pi-briefcase",
      children: orgNodes,
    },
  ];

  return (
    <div className="flex flex-column w-full border-0 gap-2">
      <div className="flex flex-column w-full">
        <label htmlFor="birth_date">Date Range</label>
        <Calendar
          className="w-full"
          value={[startDate, endDate]}
          onChange={(e) => {
            const range = e.value;
            if (!range) {
              setStartDate(null);
              setEndDate(null);
            } else {
              const [start, end] = range;
              setStartDate(start || null);
              setEndDate(end || null);
            }
          }}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
        />
      </div>
      <div className="flex flex-column w-full">
        <Button
          label="Update Report"
          icon="pi pi-refresh"
          severity="success"
          onClick={() => getRecentDisclosures({ startDate, endDate })}
        />
      </div>
      <div className="flex flex-column w-full">
        <Button
          label="Download"
          icon="pi pi-download"
          onClick={exportFormatted}
        />
      </div>
      <div className="flex justify-content-center mb-2">
        <Tree
          value={menuItems}
          selectionMode="checkbox"
          selectionKeys={orgSelectionKeys}
          onSelectionChange={(e) => setOrgSelectionKeys(e.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default observer(MLDRSideBar);
