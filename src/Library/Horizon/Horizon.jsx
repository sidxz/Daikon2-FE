import { observer } from "mobx-react-lite";
import { ProgressBar } from "primereact/progressbar";
import React, { useContext, useEffect, useMemo } from "react";
import Tree from "react-d3-tree";
import { RootStoreContext } from "../../RootStore";
import HorizonNode from "./components/HorizonNode/HorizonNode";

const Horizon = ({ entryPoint }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    fetchHorizon,
    isFetchingHorizon,
    selectedHorizon,
    isHorizonCacheValid,
  } = rootStore.horizonStore;

  if (!entryPoint) {
    return <div>Missing entryPoint</div>;
  }

  useEffect(() => {
    fetchHorizon(entryPoint);
  }, [fetchHorizon]);

  const nodeSize = useMemo(() => ({ x: 160, y: 150 }), []);

  const textLayout = useMemo(() => ({ textAnchor: "start", x: 0, y: 0 }), []);
  const foreignObjectProps = useMemo(
    () => ({ width: nodeSize.x, height: nodeSize.y, x: 30 }),
    [nodeSize]
  );
  const translate = useMemo(() => {
    const horizonMatches = (
      JSON.stringify(selectedHorizon).match(/[^\\]":/g) || []
    ).length;
    return { x: 30, y: (horizonMatches / 2) * 6 };
  }, [selectedHorizon]);

  if (isFetchingHorizon) {
    return <ProgressBar mode="indeterminate" style={{ height: "6px" }} />;
  }

  console.log(selectedHorizon);

  if (selectedHorizon !== null && !isFetchingHorizon) {
    return (
      <>
        <div className="flex w-full h-30rem border-1 border-50">
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
                entryPoint={entryPoint}
              />
            )}
          />
        </div>
      </>
    );
  }
};

export default observer(Horizon);
