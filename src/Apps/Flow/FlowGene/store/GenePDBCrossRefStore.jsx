import { action, makeObservable, observable, runInAction } from "mobx";
import EbiAPI from "../api/EbiAPI";
import UniprotAPI from "../api/UniprotAPI";
import {
  _helper_extractPdbCrossReference,
  _helper_formatLigands,
} from "./GenePDBCrossRefStoreHelper";

export default class GenePDBCrossRefStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchPdbCrossReference: action,
      isFetchingPDBCrossRef: observable,
      selectedPdbCrossReference: observable,
      pdbCrossReferenceRegistry: observable,
    });
  }

  isFetchingPDBCrossRef = false;
  pdbCrossReferenceRegistry = new Map();
  selectedPdbCrossReference = null;

  /* Fetch PDB cross reference with id from API */

  fetchPdbCrossReference = async (accessionNumber, uniProtId) => {
    this.isFetchingPDBCrossRef = true;

    if (uniProtId === null) {
      console.error("UniProt Id is not found returning...");
      this.isFetchingPDBCrossRef = false;
      this.selectedPdbCrossReference = null;
      return;
    }

    let fetchedPdbCrossReference =
      this.pdbCrossReferenceRegistry.get(accessionNumber);

    // check cache
    if (fetchedPdbCrossReference) {
      this.selectedPdbCrossReference = fetchedPdbCrossReference;
      this.isFetchingPDBCrossRef = false;
    } else {
      try {
        // fetch from api
        fetchedPdbCrossReference = await UniprotAPI.getCrossReference(
          uniProtId
        );

        // from the bulk of data extract the Cross reference part
        let fetchedPdbCrossReferenceArray = _helper_extractPdbCrossReference(
          fetchedPdbCrossReference
        );

        // Now add ligands to each protein
        let fetchedPdbCrossReferenceArrayWithLigand = [];
        /*TIP: async will not work with foreach loop, use Promise.all and map method instead */
        await Promise.all(
          fetchedPdbCrossReferenceArray.map(async (nObj) => {
            // fetch from ebi
            let ligands = await EbiAPI.getLigands(nObj.id);

            nObj.ligands = _helper_formatLigands(ligands);

            fetchedPdbCrossReferenceArrayWithLigand.push(nObj);
          })
        );

        runInAction(() => {
          this.pdbCrossReferenceRegistry.set(accessionNumber, {
            accessionNumber: accessionNumber,
            data: fetchedPdbCrossReferenceArrayWithLigand,
          });
          this.selectedPdbCrossReference = {
            accessionNumber: accessionNumber,
            data: fetchedPdbCrossReferenceArrayWithLigand,
          };
        });
      } catch (error) {
        console.error("PDB Error Catch");
        console.error(error);
      } finally {
        runInAction(() => {
          this.isFetchingPDBCrossRef = false;
        });
      }
    }
  };
}
