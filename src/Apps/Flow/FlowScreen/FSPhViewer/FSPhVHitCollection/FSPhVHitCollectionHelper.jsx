import { hitCollectionTypeOptions } from "../../shared/FSValues";

export const addSideBarHeader = (
  <div className="flex align-items-center gap-2">
    <i className="icon icon-common icon-plus-circle"></i>
    <span className="font-bold">Add Hit Collection</span>
  </div>
);

export const hitCollectionNameTemplate = (hitCollection) => {
  return (
    hitCollectionTypeOptions.find(
      (option) => option.value === hitCollection.hitCollectionType
    )?.name +
    " (" +
    hitCollection.name +
    ")"
  );
};

export const breadCrumbItems = (selectedScreen, navigate) => {
  return [
    {
      label: "Screens",
      command: () => {
        navigate("/wf/screen/dash/");
      },
    },
    {
      label: "Phenotypic",
      command: () => {
        navigate("/wf/screen/dash/phenotypic/");
      },
    },
    {
      label: selectedScreen.name,
      command: () => {
        navigate(`/wf/screen/viewer/ph/${selectedScreen.id}`);
      },
    },
    { label: "Hits" },
  ];
};
