import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import HitCollectionAPI from "../api/HitCollectionAPI";

export default class HitCollectionStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchHitCollectionsOfScreen: action,
      isFetchingHitCollection: observable,
      hitCollectionRegistry: observable,
      isHitCollectionRegistryCacheValid: action,
      hitCollectionRegistryCache: observable,
      selectedHitCollection: observable,
      hitCollectionOfScreen: action,

      isUpdatingHitCollection: observable,
      updateHitCollection: action,

      isAddingHitCollection: observable,
      addHitCollection: action,

      isDeletingHitCollection: observable,
      deleteHitCollection: action,

      invalidateHitCollectionCacheOfSelectedScreen: action,

      getHitCollection: action,
    });
  }

  // Observables

  isFetchingHitCollection = false;
  hitCollectionRegistry = new Map();
  hitCollectionRegistryCache = new Map();
  selectedHitCollection = null;

  isUpdatingHitCollection = false;
  isAddingHitCollection = false;
  isDeletingHitCollection = false;

  // Actions

  invalidateHitCollectionCacheOfSelectedScreen = () => {
    this.hitCollectionRegistryCache.set(
      this.rootStore.screenStore.selectedScreen.id,
      false
    );
  };

  isHitCollectionRegistryCacheValid = (screenId) => {
    return this.hitCollectionRegistryCache.get(screenId);
  };

  fetchHitCollectionsOfScreen = async (screenId, inValidateCache = false) => {
    console.log("fetchHitCollectionsOfScreen", screenId, inValidateCache);
    if (inValidateCache) {
      this.hitCollectionRegistryCache.set(screenId, false);
    }

    if (this.hitCollectionRegistryCache.get(screenId)) {
      console.log("hitCollectionRegistryCache HIT");
      return;
    }

    // if screenId is null, undefined, or empty, fallback to selectedScreen.screenId
    screenId = screenId?.trim() || this.rootStore.screenStore.selectedScreen.id;

    this.isFetchingHitCollection = true;

    try {
      var hitCollections = await HitCollectionAPI.listByScreen(screenId);
      runInAction(() => {
        hitCollections.forEach((hitCollection) => {
          this.hitCollectionRegistry.set(hitCollection.id, hitCollection);
        });
        this.hitCollectionRegistryCache.set(screenId, true);
      });
    } catch (error) {
      console.error("Error fetching hitCollection:", error);
    } finally {
      runInAction(() => {
        this.isFetchingHitCollection = false;
      });
    }
  };

  hitCollectionOfScreen = (screenId) => {
    return Array.from(this.hitCollectionRegistry.values()).filter(
      (hitCollection) => hitCollection.screenId === screenId
    );
  };

  getHitCollection = (hitCollectionId) => {
    // check if hitCollectionId is found in hitCollectionRegistry, if not fetch it
    if (!this.hitCollectionRegistry.has(hitCollectionId)) {
      this.fetchHitCollectionsOfScreen(
        this.rootStore.screenStore.selectedScreen.id
      );
    }
    this.selectedHitCollection =
      this.hitCollectionRegistry.get(hitCollectionId);
    return this.hitCollectionRegistry.get(hitCollectionId);
  };

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
        hitCollection.id = res.id;
        hitCollection.hits = [];

        // this.selectedHitCollection?.hitCollections.push(hitCollection);
        this.hitCollectionRegistry.set(hitCollection.id, hitCollection);
        this.selectedHitCollection = hitCollection;

        toast.success("Hit Collection added successfully");
      });
      return res.id;
    } catch (error) {
      console.error("Error adding Hit Collection:", error);
    } finally {
      runInAction(() => {
        this.isAddingHitCollection = false;
      });
    }
  };

  updateHitCollection = async (hitCollection) => {
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
        // update in hit collection registry
        this.hitCollectionRegistry.set(hitCollection.id, hitCollection);

        // update the same in selected hit collection
        this.selectedHitCollection = hitCollection;

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
        // remove hitCollection from hit collection registry
        this.hitCollectionRegistry.delete(hitCollectionId);

        // invalidate cache
        this.hitCollectionRegistryCache.set(screenId, false);
        // set selected hit collection to first hit collection of that screen or null
        this.selectedHitCollection =
          this.hitCollectionOfScreen(screenId)[0] || null;

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
