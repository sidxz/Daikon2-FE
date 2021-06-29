import { Fieldset } from "primereact/fieldset";
import KeyValList from "../../../../app/common/KeyValList/KeyValList";
import GeneViewMycoBrowswerProteindataBank from "./GeneViewMycobrowswerProteinDataBank/GeneViewMycoBrowswerProteindataBank";

const GeneViewMycobrowswer = ({ gene, edit, cancelEdit, fetchGeneHistory, historyDisplayLoading, geneHistory }) => {
  console.log("From Gene View");

  
  return (
    <div>
      <div className="p-d-flex">
        <div className="p-mr-2">
          <div className="p-d-flex p-flex-column">
            <div className="p-mb-2">
              <Fieldset legend="General annotation">
                <KeyValList
                  data={gene.genePublicData}
                  filter={["type", "comments", "proteomics", "mutant"]}
                  editFunc={() => edit()}
                  cancelEdit={() => cancelEdit()}
                  fetchHistory={() => fetchGeneHistory()}
                  historyDisplayLoading={historyDisplayLoading}
                  history={geneHistory}
                />
              </Fieldset>
            </div>
            <div className="p-mb-2">
              <Fieldset legend="Protein summary">
                <KeyValList
                  data={gene.genePublicData}
                  filter={[
                    "molecularMass",
                    "isoelectricPoint",
                    "proteinLength",
                  ]}
                  editFunc={() => edit()}
                  cancelEdit={() => cancelEdit()}
                />
              </Fieldset>
            </div>
            <div className="p-mb-2">
              <Fieldset legend="Protein Databank">
                <GeneViewMycoBrowswerProteindataBank
                  accessionNumber={gene.accessionNumber}
                />
              </Fieldset>
            </div>
          </div>
        </div>
        <div className="p-mr-2">
          <div className="p-d-flex p-flex-column">
            <div className="p-mb-2">
              <Fieldset legend="Coordinates">
                <KeyValList
                  data={gene.genePublicData}
                  filter={["start", "end", "orientation"]}
                  editFunc={() => edit()}
                  cancelEdit={() => cancelEdit()}
                />
              </Fieldset>
            </div>
            <div className="p-mb-2">
              <Fieldset legend="Gene summary">
                <KeyValList
                  data={gene.genePublicData}
                  filter={["geneLength", "location"]}
                  editFunc={() => edit()}
                  cancelEdit={() => cancelEdit()}
                />
              </Fieldset>
            </div>
            <div className="p-mb-2">
              <Fieldset legend="Orthologues">
                <KeyValList
                  data={gene.genePublicData}
                  filter={["m_Leprae", "m_Marinum", "m_Smegmatis"]}
                  link={{ m_Leprae: "https://mycobrowser.epfl.ch/genes/" }}
                  editFunc={() => edit()}
                  cancelEdit={() => cancelEdit()}
                />
              </Fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneViewMycobrowswer;