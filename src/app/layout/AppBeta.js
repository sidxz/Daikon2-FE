import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

const AppBeta = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    {
      name: "Active",
      code: "AU",
      description:
        "A compound that engages the target was shown to be active in a C3HeB/FeJ-Chronic infection efficacy study.",
    },
    {
      name: "Inactive",
      code: "BR",
      description:
        "A compound  that engages the target was shown to be inactive in a C3HeB/FeJ-Chronic infection efficacy study.",
    },
    {
      name: "Unknown",
      code: "BR",
      description:
        "No compound that engages the target has progressed to a C3HeB/FeJ-Chronic infection efficacy study.  Alternatively, the level of target engagement for a particular compound that has progressed to a C3HeB/FeJ-Chronic infection efficacy study is uncertain.",
    },
  ];

  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex flex-column gap-2 max-w-30rem flex-wrap">
          <div className="flex font-bold text-xl">{option.name}</div>
          {/* <div className="flex flex-wrap white-space-normal">
            {option.description}
          </div> */}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const optionTemplate = (option) => {
    return (
      <div className="flex flex-column gap-2 max-w-30rem flex-wrap pt-2">
        <div className="flex font-bold text-xl border-bottom-1 border-400">
          {option.name}
        </div>
        <div className="flex flex-wrap white-space-normal">
          {option.description}
        </div>
      </div>
    );
  };

  return (
    <div className="card flex p-4 m-4 w-30rem">
      <Dropdown
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.value)}
        options={options}
        optionLabel="name"
        placeholder="Select an Option"
        valueTemplate={selectedOptionTemplate}
        itemTemplate={optionTemplate}
        className="w-full"
      />
    </div>
  );
};

export default observer(AppBeta);
