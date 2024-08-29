import _ from "lodash";
import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DataView } from "primereact/dataview";
import { Fieldset } from "primereact/fieldset";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../RootStore";
import { AppOrgResolver } from "../../../../../Shared/VariableResolvers/AppOrgResolver";
import { generateLink } from "./MLMRelLinkGen";

const MLMViewRelations = ({ selectedMolecule }) => {
  const rootStore = useContext(RootStoreContext);
  const navigate = useNavigate();
  const {
    isFetching,
    associations,
    selectedMoleculeId,
    fetchAssociationsForMolecule,
  } = rootStore.moleculeAssociationStore;

  useEffect(() => {
    if (
      selectedMoleculeId === undefined ||
      selectedMoleculeId !== selectedMolecule?.id
    ) {
      fetchAssociationsForMolecule(selectedMolecule?.id);
    }
  }, [selectedMolecule?.id, fetchAssociationsForMolecule, selectedMoleculeId]);

  if (isFetching) {
    return <div>Please wait...</div>;
  }

  const { getOrgAliasById } = AppOrgResolver();
  const propertiesToInclude = [
    "stage",
    "screenType",
    "screenStatus",
    "status",
    "orgId",
  ];

  console.log(associations);

  let data = associations.map((item) => {
    const filteredProperties = _.pick(item.nodeProperties, propertiesToInclude);
    // check if filteredProperties has orgId
    if (filteredProperties.orgId) {
      filteredProperties.org = getOrgAliasById(filteredProperties.orgId);
      // remove orgId from filteredProperties
      delete filteredProperties.orgId;
    }
    const propertiesArray = Object.keys(filteredProperties).map((key) => ({
      name: _.startCase(key),
      value: filteredProperties[key],
    }));
    return {
      nodeType: item.nodeType,
      nodeRelation: item.nodeRelation,
      nodeName: item.nodeName,
      uniId: item.nodeProperties.uniId,
      properties: propertiesArray,
    };
  });

  //data = data.filter((item) => item.nodeRelation !== "INITIAL_HIT_MOLECULE");

  const itemTemplate = (node, index) => {
    return (
      <div className="col-3 p-2" key={node.uniId}>
        <div className="flex flex-column w-full shadow-1 hover:shadow-3 border-round-md">
          <div
            className="flex flex-column  justify-content-center cursor-pointer "
            onClick={() => {
              navigate(generateLink(associations, node.uniId));
            }}
          >
            <div
              className="flex flex-column justify-content-center border-round-top-md "
              style={{
                backgroundColor: "#eee",
              }}
            >
              <div className="flex p-2 text-lg text-100 text-black-alpha-90 justify-content-center">
                {node.nodeName}
              </div>
            </div>
            <div className="flex justify-content-center border-green-100 border-bottom-1">
              <div
                className="flex justify-content-center align-items-center w-full p-2 text-700 border-right-1 border-green-100"
                style={{
                  minWidth: "4rem",
                }}
              >
                {_.startCase(node.nodeType)}
              </div>

              <div
                className="flex justify-content-center align-items-center w-full p-2 text-700"
                style={{
                  minWidth: "4rem",
                }}
              >
                {_.startCase(node.nodeRelation.toLowerCase())}
              </div>
            </div>
            <div className="flex w-full p-2 justify-content-left">
              <DataTable
                value={node.properties}
                className="HideDataTableHeader"
              >
                <Column field="name"></Column>
                <Column
                  style={{ wordBreak: "break-all" }}
                  field="value"
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  console.log(data);

  return (
    <div className="flex pt-2 w-full">
      <Fieldset className="m-0 flex-grow-1" legend="Associations">
        <DataView value={data} listTemplate={listTemplate} rows={5} />
      </Fieldset>
    </div>
  );
};

export default observer(MLMViewRelations);
