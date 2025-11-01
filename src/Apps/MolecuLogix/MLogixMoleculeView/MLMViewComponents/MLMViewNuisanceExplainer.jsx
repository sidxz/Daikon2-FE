import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";
import { ML_GENERATED_TOOLTIP } from "../../../../constants/strings";
import MolDbAPI from "../../api/MolDbAPI";

const MLMViewNuisanceExplainer = ({ selectedMolecule }) => {
  const [fetchingExplanation, setFetchingExplanation] = useState(true);
  const [explanationData, setExplanationData] = useState(null);

  const dto = {
    plotAllAttention: true,
    nuisanceRequestTuple: {
      smiles: selectedMolecule.smilesCanonical,
      id: selectedMolecule.id,
    },
  };

  // fetch from api
  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        // Call the API to get the explanation
        const response = await MolDbAPI.explainNuisance(dto);

        // Process the response as needed
        setExplanationData(response);
      } catch (error) {
        console.error("Error fetching nuisance explanation:", error);
      } finally {
        setFetchingExplanation(false);
      }
    };
    fetchExplanation();
  }, [selectedMolecule]);

  console.log("Explanation Data:", explanationData);

  if (fetchingExplanation) {
    return (
      <div className="flex flex-column align-items-center justify-content-center p-5">
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px", width: "100%" }}
        ></ProgressBar>
        <span className="m-2">Running CF model. Please wait ...</span>
        <span>{ML_GENERATED_TOOLTIP}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-column w-full">
      <div className="flex justify-content-center">
        <div className="flex">
          <Card className="w-full" title="Functional Group Prompt Attention">
            <img
              width={470}
              src={`data:image/png;base64,${explanationData?.rows?.[0]?.prompt_atn_image_base64}`}
              alt="Attention Summary"
            />
          </Card>
        </div>
        {/* <div className="flex">
          <Card className="w-full" title="Atom Graph Attention">
            <img
              width={500}
              src={`data:image/png;base64,${explanationData?.rows?.[0]?.atom_total_contrib_base64}`}
              alt="Attention Summary"
              className="p-2"
            />
          </Card>
        </div> */}
        <div className="flex">
          <Card className="w-full" title="Overall Contribution">
            <img
              width={470}
              src={`data:image/png;base64,${explanationData?.rows?.[0]?.overall_contrib_base64}`}
              alt="Attention Summary"
              className="p-2"
            />
          </Card>
        </div>
      </div>
      <div className="flex justify-content-center mt-4">
        <span>{ML_GENERATED_TOOLTIP}</span>
      </div>
    </div>
  );
};

export default MLMViewNuisanceExplainer;
