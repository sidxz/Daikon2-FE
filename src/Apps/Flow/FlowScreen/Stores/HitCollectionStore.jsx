import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import HitCollectionAPI from "../api/HitCollectionAPI";

export default class HitCollectionStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isUpdatingHitCollection: observable,
      updateHitCollection: action,

      isAddingHitCollection: observable,
      addHitCollection: action,

      isDeletingHitCollection: observable,
      deleteHitCollection: action,
    });
  }

  // Observables
  isUpdatingHitCollection = false;
  isAddingHitCollection = false;
  isDeletingHitCollection = false;

  // Actions
  addHitCollection = async (hitCollection) => {
    this.isAddingHitCollection = true;

    // Ensure hitCollection.screenId is set, fallback to selectedScreen.screenId if null, undefined, or empty
    hitCollection.screenId =
      hitCollection.screenId?.trim() ||
      this.rootStore.screenStore.selectedScreen.Id;

    try {
      var res = await HitCollectionAPI.create(hitCollection);
      runInAction(() => {
        // Add hitCollection to hitCollection list
        console.log(res);
        hitCollection.id = res.id;

        console.log("Add with id hitCollection:", hitCollection);
        this.rootStore.screenStore.selectedScreen.hitCollections.push(
          hitCollection
        );
        const screen = this.rootStore.screenStore.screenRegistry.get(
          hitCollection.screenId
        );
        screen.hitCollections.push(hitCollection);

        toast.success("Hit Collection added successfully");
      });
    } catch (error) {
      console.error("Error adding Hit Collection:", error);
    } finally {
      runInAction(() => {
        this.isAddingHitCollection = false;
      });
    }
  };

  updateHitCollection = async (hitCollection) => {
    console.log("updateHitCollection:", hitCollection);
    this.isUpdatingHitCollection = true;

    // Ensure hitCollection.screenId is set, fallback to selectedScreen.screenId if null, undefined, or empty
    hitCollection.screenId =
      hitCollection.screenId?.trim() ||
      this.rootStore.screenStore.selectedScreen.id;

    // Ensure hitCollection.hitCollectionId is not null, undefined, or empty
    if (!hitCollection.id?.trim()) {
      throw new Error("hitCollectionId is required and cannot be empty.");
    }

    try {
      await HitCollectionAPI.update(hitCollection);
      runInAction(() => {
        // update in screen registry list
        const screen = this.rootStore.screenStore.screenRegistry.get(
          hitCollection.screenId
        );

        const indexOfEss = screen.hitCollections.findIndex(
          (e) => e.id === hitCollection.id
        );
        screen.hitCollections[indexOfEss] = hitCollection;

        // update the same in selected screen
        const selectedScreen = this.rootStore.screenStore.selectedScreen;
        const selectedIndex = selectedScreen.hitCollections.findIndex(
          (e) => e.id === hitCollection.id
        );

        selectedScreen.hitCollections[selectedIndex] = hitCollection;

        toast.success("Gene hitCollection updated successfully");
      });
    } catch (error) {
      console.error("Error updating screen hitCollection:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingHitCollection = false;
      });
    }
  };

  deleteHitCollection = async (hitCollectionId) => {
    this.isDeletingHitCollection = true;

    const screenId = this.rootStore.screenStore.selectedScreen.id;

    // Ensure hitCollectionId is not null, undefined, or empty
    if (!hitCollectionId?.trim()) {
      throw new Error("hitCollectionId is required and cannot be empty.");
    }

    try {
      await HitCollectionAPI.delete(screenId, hitCollectionId);
      runInAction(() => {
        // remove hitCollection from screen hitCollection list
        const screen = this.rootStore.screenStore.screenRegistry.get(screenId);
        const indexOfEss = screen.hitCollections.findIndex(
          (e) => e.id === hitCollectionId
        );
        screen.hitCollections.splice(indexOfEss, 1);

        // remove the same from selected screen
        const selectedScreen = this.rootStore.screenStore.selectedScreen;
        const selectedIndex = selectedScreen.hitCollections.findIndex(
          (e) => e.id === hitCollectionId
        );
        selectedScreen.hitCollections.splice(selectedIndex, 1);

        toast.success("Gene hitCollection deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting screen hitCollection:", error);
    } finally {
      runInAction(() => {
        this.isDeletingHitCollection = false;
      });
    }
  };
}
