import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import HitAPI from "../api/HitAPI";

export default class HitStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingHit: observable,
      updateHit: action,

      isAddingHit: observable,
      addHit: action,

      isDeletingHit: observable,
      deleteHit: action,
      isBatchInsertingHits: observable,
      batchInsertHits: action,
    });
  }

  // Observables
  isUpdatingHit = false;
  isAddingHit = false;
  isDeletingHit = false;
  isBatchInsertingHits = false;

  // Actions
  addHit = async (hit, silent = false) => {
    this.isAddingHit = true;

    // Ensure hit.hitCollectionId is set ,error out if not
    if (!hit.hitCollectionId?.trim()) {
      throw new Error("hitCollectionId is required and cannot be empty.");
    }

    try {
      var res = await HitAPI.create(hit);
      runInAction(() => {
        // Add hit to hit list
        hit.id = res.id;
        hit.usersVote = hit.usersVote || "NA";
        hit.voters = hit.voters || {};
        const hitCollection =
          this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
            hit.hitCollectionId
          );
        hitCollection.hits.push(hit);

        this.rootStore.hitCollectionStore.selectedHitCollection = hitCollection;

        if (!silent) toast.success("Hit added successfully");
      });
    } catch (error) {
      console.error("Error adding Hit:", error);
    } finally {
      runInAction(() => {
        this.isAddingHit = false;
      });
    }
  };

  updateHit = async (hit, silent = false) => {
    this.isUpdatingHit = true;

    // Ensure hit.hitCollectionId is set, fallback to selectedHitCollection.hitCollectionId if null, undefined, or empty
    hit.hitCollectionId =
      hit.hitCollectionId?.trim() ||
      this.rootStore.hitCollectionStore.selectedHitCollection.id;

    // Ensure hit.hitId is not null, undefined, or empty
    if (!hit.id?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }
    hit.hitId = hit.id;

    try {
      await HitAPI.update(hit);
      runInAction(() => {
        // update in hitCollection registry list
        const hitCollection =
          this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
            hit.hitCollectionId
          );

        const indexOfEss = hitCollection.hits.findIndex((e) => e.id === hit.id);
        hitCollection.hits[indexOfEss] = hit;
        this.rootStore.hitCollectionStore.selectedHitCollection = hitCollection;

        if (!silent) toast.success("Hit updated successfully");
      });
    } catch (error) {
      console.error("Error updating hitCollection hit:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHit = false;
      });
    }
  };

  deleteHit = async (hitId) => {
    this.isDeletingHit = true;

    const hitCollectionId =
      this.rootStore.hitCollectionStore.selectedHitCollection.id;

    // Ensure hitId is not null, undefined, or empty
    if (!hitId?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }

    try {
      await HitAPI.delete(hitCollectionId, hitId);
      runInAction(() => {
        // remove hit from hitCollection hit list
        const hitCollection =
          this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
            hitCollectionId
          );
        const indexOfEss = hitCollection.hits.findIndex((e) => e.id === hitId);
        hitCollection.hits.splice(indexOfEss, 1);
        this.rootStore.hitCollectionStore.selectedHitCollection = hitCollection;

        toast.success("Hit deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting hitCollection hit:", error);
    } finally {
      runInAction(() => {
        this.isDeletingHit = false;
      });
    }
  };

  /**
   * Batch insert a hits
   * Adds new if ExternalCompoundId is null, updates if ExternalCompoundId is not null.
   * @param {object} editedHitRows - The details of the hit rows to edit.
   */
  batchInsertHits = async (editedHitRows) => {
    this.isBatchInsertingHits = true;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const promises = editedHitRows.map(async (editedHitRow) => {
        console.log("editedHitRow", editedHitRow);
        // Fix ids and map smiles to requestedSMILES
        editedHitRow.hitCollectionId =
          this.rootStore.hitCollectionStore.selectedHitCollection.id;
        editedHitRow.requestedSMILES = editedHitRow.smiles;

        await delay(5000);
        console.log("Sending --->>> editedHitRow", editedHitRow);
        if (editedHitRow.status === "New") {
          return await this.addHit(editedHitRow, true);
        } else if (editedHitRow.status === "Modified") {
          return await this.updateHit(editedHitRow, true);
        }
      });

      await Promise.all(promises);
      toast.success("Batch insertion/update completed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isBatchInsertingHits = false;
      });
    }
  };
}
