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
    });
  }

  // Observables
  isUpdatingHit = false;
  isAddingHit = false;
  isDeletingHit = false;

  // Actions
  addHit = async (hit) => {
    this.isAddingHit = true;

    // Ensure hit.hitCollectionId is set ,error out if not
    if (!hit.hitCollectionId?.trim()) {
      throw new Error("hitCollectionId is required and cannot be empty.");
    }

    try {
      var res = await HitAPI.create(hit);
      runInAction(() => {
        // Add hit to hit list
        console.log(res);
        hit.id = res.id;

        console.log("Add with id hit:", hit);
        //this.rootStore.hitCollectionStore.selectedHitCollection.hits.push(hit);
        const hitCollection =
          this.rootStore.hitCollectionStore.hitCollectionRegistry.get(
            hit.hitCollectionId
          );
        hitCollection.hits.push(hit);

        this.rootStore.hitCollectionStore.invalidateHitCollectionCacheOfSelectedScreen();

        toast.success("Hit added successfully");
      });
    } catch (error) {
      console.error("Error adding Hit:", error);
    } finally {
      runInAction(() => {
        this.isAddingHit = false;
      });
    }
  };

  updateHit = async (hit) => {
    console.log("updateHit:", hit);
    this.isUpdatingHit = true;

    // Ensure hit.hitCollectionId is set, fallback to selectedHitCollection.hitCollectionId if null, undefined, or empty
    hit.hitCollectionId =
      hit.hitCollectionId?.trim() ||
      this.rootStore.hitCollectionStore.selectedHitCollection.id;

    // Ensure hit.hitId is not null, undefined, or empty
    if (!hit.id?.trim()) {
      throw new Error("hitId is required and cannot be empty.");
    }

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

        // update the same in selected hitCollection
        const selectedHitCollection =
          this.rootStore.hitCollectionStore.selectedHitCollection;
        const selectedIndex = selectedHitCollection.hits.findIndex(
          (e) => e.id === hit.id
        );

        selectedHitCollection.hits[selectedIndex] = hit;

        toast.success("Hit updated successfully");
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

        // remove the same from selected hitCollection
        const selectedHitCollection =
          this.rootStore.hitCollectionStore.selectedHitCollection;
        const selectedIndex = selectedHitCollection.hits.findIndex(
          (e) => e.id === hitId
        );
        selectedHitCollection.hits.splice(selectedIndex, 1);

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
}
