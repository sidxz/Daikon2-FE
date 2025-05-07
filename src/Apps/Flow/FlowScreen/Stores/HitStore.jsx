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
    // Ensure Molecule Name is set
    if (!hit.moleculeName?.trim()) {
      throw new Error("Hit must have a non-empty moleculeName.");
    }

    // Ensure hit.hitCollectionId is set ,error out if not
    if (!hit.hitCollectionId?.trim()) {
      throw new Error("Hit must have a non-empty hitCollectionId.");
    }

    // if clusterGroup is empty, set it to 0
    if (!hit?.clusterGroup) {
      hit.clusterGroup = 0;
    }

    try {
      console.log("addHit", hit);
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

  /*
   * Updates an existing Hit
   * @param {Object} hit - The hit object to be updated
   * @param {Boolean} silent - Whether to suppress success notifications
   */

  updateHit = async (hit, silent = false) => {
    this.isUpdatingHit = true;

    // Ensure hit.hitCollectionId is set, fallback to selectedHitCollection.hitCollectionId if null, undefined, or empty
    hit.hitCollectionId =
      hit.hitCollectionId?.trim() ||
      this.rootStore.hitCollectionStore.selectedHitCollection.id;

    // Ensure hit.hitId is not null, undefined, or empty
    if (!hit.id?.trim()) {
      throw new Error("Hit must have a non-empty id.");
    }
    hit.hitId = hit.id;

    // if clusterGroup is empty, set it to 0
    if (!hit?.clusterGroup) {
      hit.clusterGroup = 0;
    }
    console.log("Updating Hit:", hit);

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

  /*
   * Batch Insert/Update Hits
   * Inserts new hits where needed, updates modified hits
   * @param {Array} editedHitRows - The array of edited hits
   */

  batchInsertHits = async (hitRows) => {
    console.log("Batch Insert Hits", hitRows);
    this.isBatchInsertingHits = true;

    try {
      let newHits = [];
      let updatedHits = [];
      for (const hitRow of hitRows) {
        // Reject rows if they dont have a moleculeName
        if (!hitRow.moleculeName?.trim()) {
          throw new Error("Molecule Name is required for all hits.");
        }
        // Fix ids and map smiles to requestedSMILES
        hitRow.hitCollectionId =
          this.rootStore.hitCollectionStore.selectedHitCollection.id;
        hitRow.requestedSMILES = hitRow.smiles;

        // If clusterGroup is empty, set it to 0
        if (!hitRow?.clusterGroup) {
          hitRow.clusterGroup = 0;
        }

        if (hitRow.status === "New") {
          newHits.push(hitRow);
        } else if (hitRow.status === "Modified") {
          hitRow.hitId = hitRow.id;
          updatedHits.push(hitRow);
        }
      }

      if (newHits.length > 0) {
        let newHitsRes = await HitAPI.createBatch(
          this.rootStore.hitCollectionStore.selectedHitCollection.id,
          newHits
        );
        runInAction(() => {
          // Add new hits to hit list
          for (const newHit of newHitsRes) {
            newHit.usersVote = newHit.usersVote || "NA";
            newHit.voters = newHit.voters || {};
            const hitCollection =
              this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
                newHit.hitCollectionId
              );
            hitCollection.hits.push(newHit);
            this.rootStore.hitCollectionStore.selectedHitCollection =
              hitCollection;
          }
        });
      }

      if (updatedHits.length > 0) {
        let updateHitsRes = await HitAPI.updateBatch(
          this.rootStore.hitCollectionStore.selectedHitCollection.id,
          updatedHits
        );
        runInAction(() => {
          // update in hitCollection registry list

          for (const res of updateHitsRes) {
            const hitCollection =
              this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
                res.hitCollectionId
              );

            const hitIndex = hitCollection.hits.findIndex(
              (e) => e.id === res.id
            );
            //console.log("hitIndex", hitIndex);
            const existingHit = hitCollection.hits[hitIndex];
            //console.log("existingHit", existingHit);
            let updatedHit = { ...existingHit, ...res };
            //console.log("updatedHit", updatedHit);

            // properties to preserve of existing hit, these properties are unchanged and are missing from the response
            // from the server
            const propertiesToPreserve = [
              "lastModifiedById",
              "molecule",
              "moleculeId",
              "moleculeRegistrationId",
              "negative",
              "neutral",
              "positive",
              "requestedMoleculeName",
              "requestedSMILES",
              "voteScore",
              "usersVote",
              "voters",
            ];
            propertiesToPreserve.forEach((property) => {
              if (existingHit[property] !== undefined) {
                updatedHit[property] = existingHit[property];
              }
            });

            hitCollection.hits[hitIndex] = updatedHit;
            this.rootStore.hitCollectionStore.selectedHitCollection =
              hitCollection;
          }
        });
      }

      runInAction(() => {
        toast.success("Hits batch inserted successfully");
      });
    } catch (error) {
      console.error("Error during batch insert/update:", error);
      toast.error(`${error?.message} Batch operation failed. `);
    } finally {
      runInAction(() => {
        this.isBatchInsertingHits = false;
      });
    }
  };
}
