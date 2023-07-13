import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo } from "react";
import { Tree } from "react-d3-tree";
import { RootStoreContext } from "../../stores/rootStore";
import FailedLoading from "../FailedLoading/FailedLoading";
import PleaseWait from "../PleaseWait/PleaseWait";
import HorizonNode from "./HorizonNode/HorizonNode";

const Horizon = ({ accessionNumber, entryPoint }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    generatingHorizon,
    fetchHorizon,
    fetchHorizonByAccession,
    selectedHorizon,
    horizonLength,
  } = rootStore.generalStore;

  useEffect(() => {
    if (
      !generatingHorizon &&
      entryPoint &&
      (!selectedHorizon || selectedHorizon.attributes.entryPoint !== entryPoint)
    ) {
      fetchHorizon(entryPoint);
    } else if (
      !generatingHorizon &&
      accessionNumber &&
      (!selectedHorizon ||
        selectedHorizon.attributes.accessionNumber !== accessionNumber)
    ) {
      fetchHorizonByAccession(accessionNumber);
    }
  }, [
    entryPoint,
    accessionNumber,
    fetchHorizon,
    selectedHorizon,
    generatingHorizon,
  ]);

  const nodeSize = useMemo(() => ({ x: 230, y: 100 }), []);
  const textLayout = useMemo(
    () => ({ textAnchor: "start", x: 30, y: -10 }),
    []
  );
  const foreignObjectProps = useMemo(
    () => ({ width: nodeSize.x, height: nodeSize.y, x: 20 }),
    [nodeSize]
  );
  const translate = useMemo(() => {
    const horizonMatches = (
      JSON.stringify(selectedHorizon).match(/[^\\]":/g) || []
    ).length;
    return { x: 50, y: (horizonMatches / 2) * 5 };
  }, [selectedHorizon]);

  if (entryPoint === null || entryPoint === "undefined") {
    return <>Nothing</>;
  }

  if (generatingHorizon) {
    return <PleaseWait />;
  }

  console.log(selectedHorizon);

  if (!generatingHorizon && selectedHorizon !== null) {
    return (
      <div className="flex flex-column w-full">
        <div
          className="flex w-full"
          id="treeWrapper"
          style={{ height: horizonLength }}
        >
          <Tree
            data={selectedHorizon}
            nodeSize={nodeSize}
            textLayout={textLayout}
            translate={translate}
            zoom="0.9"
            collapsible={false}
            allowForeignObjects
            renderCustomNodeElement={(rd3tProps) => (
              <HorizonNode
                dataObj={rd3tProps.nodeDatum}
                toggleNode={rd3tProps.toggleNode}
                foreignObjectProps={foreignObjectProps}
              />
            )}
          />
        </div>
        <div className="flex justify-content-end pr-5 w-full">
          <p class="text-4xl text-500 font-italic m-0 p-0">Horizon View</p>
        </div>
      </div>
    );
  }

  return <FailedLoading />;
};

export default observer(Horizon);
