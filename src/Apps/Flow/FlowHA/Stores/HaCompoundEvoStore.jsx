import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import HaCompoundEvoAPI from "../api/HaCompoundEvoAPI";

export default class HaCompoundEvoStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingHaCEvo: observable,
      updateHaCEvo: action,

      isAddingHaCEvo: observable,
      addHaCEvo: action,

      isDeletingHaCEvo: observable,
      deleteHaCEvo: action,
    });
  }

  // Observables
  isUpdatingHaCEvo = false;
  isAddingHaCEvo = false;
  isDeletingHaCEvo = false;
  isBatchInsertingHits = false;

  // Actions
  addHaCEvo = async (cEvo, silent = false) => {
    this.isAddingHaCEvo = true;

    // Ensure cEvo.hitAssessmentId is set ,error out if not
    if (!cEvo.hitAssessmentId?.trim()) {
      throw new Error("hitAssessmentId is required and cannot be empty.");
    }

    // set stage to HA
    cEvo.stage = this.rootStore.haStore.selectedHa.stage || "HA";

    try {
      var res = await HaCompoundEvoAPI.add(cEvo);
      runInAction(() => {
        // Add cEvo to cEvo list
        cEvo.id = res.id;
        cEvo = { ...cEvo, ...res };

        const hitAssessment = this.rootStore.haStore.haRegistry.get(
          cEvo.hitAssessmentId
        );
        console.log("Found hitAssessment from registry", hitAssessment);
        console.log("Adding cEvo to hitAssessment", cEvo);
        hitAssessment.haCompoundEvolution.push(cEvo);

        // sort by evolutionDate
        hitAssessment.haCompoundEvolution =
          hitAssessment.haCompoundEvolution.sort(
            (a, b) => new Date(a.evolutionDate) - new Date(b.evolutionDate)
          );

        this.rootStore.haStore.selectedHa = hitAssessment;

        if (!silent)
          toast.success(
            "Compound Evolution added successfully. Please Sync to fetch calculated values."
          );
      });
    } catch (error) {
      console.error("Error adding Compound Evolution:", error);
    } finally {
      runInAction(() => {
        this.isAddingHaCEvo = false;
      });
    }
  };

  updateHaCEvo = async (cEvo, silent = false) => {
    this.isUpdatingHaCEvo = true;

    // Ensure cEvo.hitAssessmentId is set, fallback to selectedHa.hitAssessmentId if null, undefined, or empty
    cEvo.hitAssessmentId =
      cEvo.hitAssessmentId?.trim() || this.rootStore.haStore.selectedHa.id;

    // Ensure cEvo.hitId is not null, undefined, or empty
    if (!cEvo.id?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }
    cEvo.hitId = cEvo.id;

    // set stage to HA
    cEvo.stage = this.rootStore.haStore.selectedHa.stage || "HA";

    console.log("updateHaCEvo", cEvo);

    try {
      await HaCompoundEvoAPI.update(cEvo);
      runInAction(() => {
        // update in hitAssessment registry list
        const hitAssessment = this.rootStore.haStore.haRegistry.get(
          cEvo.hitAssessmentId
        );

        const indexOfEss = hitAssessment.haCompoundEvolution.findIndex(
          (e) => e.id === cEvo.id
        );
        hitAssessment.haCompoundEvolution[indexOfEss] = cEvo;

        // sort by evolutionDate
        hitAssessment.haCompoundEvolution =
          hitAssessment.haCompoundEvolution.sort(
            (a, b) => new Date(a.evolutionDate) - new Date(b.evolutionDate)
          );

        this.rootStore.haStore.selectedHa = hitAssessment;

        if (!silent) toast.success("Compound Evolution updated successfully");
      });
    } catch (error) {
      console.error("Error updating hitAssessment cEvo:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHaCEvo = false;
      });
    }
  };

  deleteHaCEvo = async (haId, cEvoId) => {
    this.isDeletingHaCEvo = true;

    const hitAssessmentId =
      haId?.trim() || this.rootStore.haStore.selectedHa.id;

    // Ensure hitId is not null, undefined, or empty
    if (!hitAssessmentId?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }

    if (!cEvoId) {
      throw new Error("Compound Evolution Id is required and cannot be empty.");
    }

    try {
      await HaCompoundEvoAPI.delete(hitAssessmentId, cEvoId);
      runInAction(() => {
        // remove cEvo from hitAssessment cEvo list
        const hitAssessment =
          this.rootStore.haStore.haRegistry.get(hitAssessmentId);
        const indexOfEss = hitAssessment.haCompoundEvolution.findIndex(
          (e) => e.id === cEvoId
        );
        hitAssessment.haCompoundEvolution.splice(indexOfEss, 1);
        this.rootStore.haStore.selectedHa = hitAssessment;

        toast.success("Compound Evolution deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting hitAssessment cEvo:", error);
    } finally {
      runInAction(() => {
        this.isDeletingHaCEvo = false;
      });
    }
  };
}
