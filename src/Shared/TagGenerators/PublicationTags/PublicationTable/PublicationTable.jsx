import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import * as Helper from "./PublicationTableHelper";
const PublicationTable = ({ publications }) => {
  const [pubData, setPubData] = useState(
    publications.map((publication) => ({
      ...publication,
      item3:
        publication.item2 === "PubMed" ? (
          <Skeleton width="5rem" className="mb-2" />
        ) : (
          publication.item3
        ),
      item4:
        publication.item2 === "PubMed" ? (
          <Skeleton width="5rem" className="mb-2" />
        ) : (
          publication.item4
        ),
      item5:
        publication.item2 === "PubMed" ? (
          <Skeleton width="5rem" className="mb-2" />
        ) : (
          publication.item5
        ),
      item6:
        publication.item2 === "PubMed" ? (
          <Skeleton width="5rem" className="mb-2" />
        ) : (
          publication.item6
        ),
      loading:
        publication.item2 === "PubMed" ? "Loading..." : publication.item3,
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const updatedPublications = await Promise.all(
        pubData.map(async (publication, index) => {
          if (
            publication.item2 === "PubMed" &&
            publication.loading === "Loading..."
          ) {
            await Helper.delay(index * 1000);
            const pubMedData = await Helper.fetchPubMedData(publication.item1);
            return {
              ...publication,
              item3: pubMedData.title,
              item4: <NavLink to={pubMedData.link}>{pubMedData.link}</NavLink>,
              item5: pubMedData.pubDate,
              item6: pubMedData.authors,
              loading: pubMedData.title,
            };
          }
          return publication;
        })
      );
      setPubData(updatedPublications);
      setLoading(false);
    };

    if (loading) {
      fetchData();
    }
  }, [loading, pubData]);

  return (
    <div className="flex w-full">
      <DataTable
        value={pubData}
        //loading={isGeneListLoading}
        className="w-full"
        emptyMessage="Loading..."
      >
        <Column
          field="item1"
          header="DOI"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
        <Column
          field="item2"
          header="Source"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
        <Column field="item3" header="Title" className="narrow-column" />
        <Column
          field="item4"
          header="Url"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
        <Column
          field="item5"
          header="Date"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
        <Column
          field="item6"
          header="Other"
          //body={Helper.accessionNumberBodyTemplate}
          className="narrow-column"
        />
      </DataTable>
    </div>
  );
};

export default observer(PublicationTable);
