import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootStoreContext } from "../../../../../../RootStore";
const FTAVApproveDialog = ({ formatTPFormValue }) => {
  const tptFormValue = formatTPFormValue();

  const navigate = useNavigate();
  console.log("tptFormValue", tptFormValue);

  const [isDraftTarget, setIsDraftTarget] = useState(false);

  const rootStore = useContext(RootStoreContext);
  const { approveTQ, isApprovingTQ } = rootStore.targetPQStore;

  const [selectedGenes, setSelectedGenes] = useState([
    ...Object.keys(tptFormValue?.requestedAssociatedGenes).map((key) => {
      return tptFormValue?.requestedAssociatedGenes[key];
    }),
  ]);
  const [proteinName, setProteinName] = useState(
    tptFormValue?.requestedTargetName
  );

  let onApproveTargetButtonClicked = () => {
    let data = {
      tPQId: tptFormValue?.id,
      response: tptFormValue?.response,
      strainId: tptFormValue?.strainId,
      targetName: proteinName,
      associatedGenes: tptFormValue?.requestedAssociatedGenes,
      isDraft: isDraftTarget,
    };

    console.log("Approve Target Data", data);
    approveTQ(data).then(() => {
      navigate("/wf/target/");
    });
  };

  if (isApprovingTQ) {
    return <div>Approving Target...</div>;
  }

  return (
    <div className="flex flex-column gap-2 w-full">
      <div className="flex flex-column gap-1 w-full">
        <div className="flex p-2">Chosen Target Name</div>
        <div className="flex">
          <InputText
            id="proteinName"
            type="text"
            className="w-full"
            placeholder="Enter Protein Name"
            value={proteinName}
            onChange={(e) => setProteinName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-column gap-1 p-2 border-50 border-1 w-full">
        <div className="flex">Selected Genes</div>
        <div className="flex">{selectedGenes.join(", ")}</div>
      </div>
      <div className="flex flex-column gap-1 p-2 border-50 border-1 w-full">
        <div className="flex align-items-center">
          <Checkbox
            inputId="draftTarget"
            name="draftTarget"
            value="draft"
            onChange={(e) => setIsDraftTarget(e.checked)}
            checked={isDraftTarget}
          />
          <label htmlFor="draftTarget" className="ml-2">
            Mark Target as "Draft"
          </label>
        </div>
      </div>

      <div className="flex mt-2">
        <Button
          label="Approve Target"
          className="w-full"
          onClick={onApproveTargetButtonClicked}
        />
      </div>
    </div>
  );
};

export default observer(FTAVApproveDialog);
