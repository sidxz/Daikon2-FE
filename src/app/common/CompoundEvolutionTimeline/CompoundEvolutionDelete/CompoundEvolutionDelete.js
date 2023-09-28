import React, { useContext } from "react";
import { RootStoreContext } from "../../../stores/rootStore";
import DeleteConfirmation from "../../DeleteConfirmation/DeleteConfirmation";

const CompoundEvolutionDelete = ({ evolution, onHide }) => {
  /* MobX Store */
  const rootStore = useContext(RootStoreContext);
  const {
    deleteCompoundEvolution,
    isDeletingCompoundEvolution,
    fetchCompoundEvolution,
  } = rootStore.compoundEvolutionStore;

  const { selectedProject } = rootStore.projectStore;

  let deleteEvo = () =>
    deleteCompoundEvolution(evolution().id).then((res) => {
      if (res !== null) {
        fetchCompoundEvolution(selectedProject.id);
        onHide();
      }
    });

  return (
    <div>
      <DeleteConfirmation callBack={deleteEvo} />
    </div>
  );
};

export default CompoundEvolutionDelete;
