import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../../../Library/Loading/Loading";
import SecHeading from "../../../Library/SecHeading/SecHeading";
import { appColors } from "../../../constants/colors";
import AdminHealthServicesAPI from "./api/AdminHealthServicesAPI";

const mapSeverityFromStatus = (statusCode) => {
  if (statusCode === 200) return "success";
  if (!statusCode) return "warning";
  if (statusCode >= 500) return "danger";
  return "warning";
};

const toServiceRows = (response) => {
  const responseBody =
    response?.body && typeof response.body === "object" ? response.body : null;

  const fallbackBody =
    !responseBody && response && typeof response === "object"
      ? Object.fromEntries(
          Object.entries(response).filter(
            ([key]) => key !== "body" && key !== "error",
          ),
        )
      : {};

  const servicesBody = responseBody ?? fallbackBody;

  return Object.entries(servicesBody).map(([key, value]) => ({
    key,
    statusCode: value?.statusCode ?? value?.status ?? null,
    service: value?.service ?? value?.name ?? "",
    version: value?.version ?? "",
    versionName: value?.versionName ?? value?.version_name ?? "",
    environment: value?.environment ?? "",
    timestamp: value?.timestamp ?? "",
    uptime: value?.uptime ?? "",
    lastCheckedUtc: value?.lastCheckedUtc ?? value?.lastCheckedUTC ?? "",
    error: value?.error ?? "",
  }));
};

const formatCell = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
};

const AdminHealthServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await AdminHealthServicesAPI.list();
      const rows = toServiceRows(response);

      setServices(rows);

      if (response?.error) {
        setError(response.error);
      }
    } catch (err) {
      const errMessage =
        typeof err === "string"
          ? err
          : err?.message ?? "Failed to load health services.";
      setServices([]);
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refreshButtonConfig = useMemo(
    () => [
      {
        label: "Refresh",
        icon: "pi pi-refresh",
        action: fetchServices,
        loading,
        disabled: loading,
      },
    ],
    [fetchServices, loading],
  );

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={formatCell(rowData.statusCode)}
      severity={mapSeverityFromStatus(rowData.statusCode)}
    />
  );

  if (loading && services.length === 0) {
    return <Loading message="Loading health services" />;
  }

  return (
    <div className="flex flex-column min-w-full fadein animation-duration-500 gap-2">
      <div className="flex w-full">
        <SecHeading
          icon="pi pi-heart"
          heading="Health Services"
          color={appColors.admin.userManagement.users}
          customButtons={refreshButtonConfig}
        />
      </div>

      {error && (
        <div className="flex w-full">
          <Message className="w-full" severity="error" text={error} />
        </div>
      )}

      <div className="flex flex-column w-full">
        <DataTable
          value={services}
          dataKey="key"
          loading={loading}
          paginator
          rows={25}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage={loading ? "Loading services..." : "No services found."}
          responsiveLayout="scroll"
        >
          <Column field="key" header="Key" sortable />
          <Column
            field="statusCode"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
          <Column field="service" header="Service" sortable />
          <Column field="version" header="Version" sortable />
          <Column field="versionName" header="Version Name" sortable />
          <Column field="environment" header="Environment" sortable />
          <Column field="timestamp" header="Timestamp" sortable />
          <Column field="uptime" header="Uptime" sortable />
          <Column field="lastCheckedUtc" header="Last Checked" sortable />
          <Column
            field="error"
            header="Error"
            body={(rowData) => formatCell(rowData.error)}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default observer(AdminHealthServices);
