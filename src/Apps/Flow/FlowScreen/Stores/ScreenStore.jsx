import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import ScreenAPI from "../api/ScreenAPI";

export default class ScreenStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      screenList: computed,
      screenListTargetBased: computed,
      screenListPhenotypic: computed,
      isFetchingScreens: observable,
      fetchScreens: action,
      screenListRegistry: observable,
      isScreenListCacheValid: observable,

      fetchScreen: action,
      isFetchingScreen: observable,
      screenRegistry: observable,
      isScreenRegistryCacheValid: observable,
      selectedScreen: observable,

      isUpdatingScreen: observable,
      updateScreen: action,

      isAddingScreen: observable,
      addScreen: action,

      isDeletingScreen: observable,
      deleteScreen: action,
    });
  }

  // Observables
  isFetchingScreens = false;
  isScreenListCacheValid = false;
  screenListRegistry = new Map();
  availableScreenFunctionalCategories = new Set();

  isFetchingScreen = false;
  screenRegistry = new Map();
  isScreenRegistryCacheValid = false;
  selectedScreen = null;

  isUpdatingScreen = false;
  isAddingScreen = false;
  isDeletingScreen = false;

  // Actions

  fetchScreens = async (inValidateCache = false) => {
    if (inValidateCache) {
      this.isScreenListCacheValid = false;
    }
    if (this.isScreenListCacheValid) {
      return;
    }
    this.isFetchingScreens = true;
    try {
      const screens = await ScreenAPI.list();
      runInAction(() => {
        screens.forEach((screen) => {
          // console.log("screen:", screen);
          this.screenListRegistry.set(screen.id, screen);
        });
        this.isScreenListCacheValid = true;
      });
    } catch (error) {
      console.error("Error fetching screens:", error);
    } finally {
      runInAction(() => {
        this.isFetchingScreens = false;
      });
    }
  };

  get screenList() {
    return Array.from(this.screenListRegistry.values());
  }

  get screenListTargetBased() {
    return this.screenList.filter(
      (screen) => screen.screenType === "target-based"
    );
  }

  get screenListPhenotypic() {
    return this.screenList.filter(
      (screen) => screen.screenType === "phenotypic"
    );
  }

  fetchScreen = async (screenId, inValidateCache = false) => {
    if (inValidateCache) {
      this.isScreenRegistryCacheValid = false;
    }

    this.isFetchingScreen = true;
    if (this.isScreenRegistryCacheValid) {
      // find screen in registry and return if found
      const screen = this.screenRegistry.get(screenId);
      if (screen) {
        this.isFetchingScreen = false;
        this.selectedScreen = screen;
      }
    }
    try {
      const screen = await ScreenAPI.getById(screenId);
      runInAction(() => {
        this.screenRegistry.set(screen.id, screen);
        this.isScreenRegistryCacheValid = true;
        this.selectedScreen = screen;
      });
    } catch (error) {
      console.error("Error fetching screen:", error);
    } finally {
      runInAction(() => {
        this.isFetchingScreen = false;
      });
    }
  };

  addScreen = async (screen) => {
    this.isAddingScreen = true;

    try {
      var res = await ScreenAPI.create(screen);
      runInAction(() => {
        // Add screen to screen list
        screen.id = res.id;
        screen.screenRuns = [];

        this.screenRegistry.set(screen.id, screen);
        this.screenListRegistry.set(screen.id, screen);
        toast.success("Screen added successfully");
      });
    } catch (error) {
      console.error("Error adding screen:", error);
    } finally {
      runInAction(() => {
        this.isAddingScreen = false;
      });
    }
  };

  updateScreen = async (screen) => {
    this.isUpdatingScreen = true;

    try {
      await ScreenAPI.update(screen);
      runInAction(() => {
        // update in screen registry list
        this.screenRegistry.set(screen.id, screen);
        this.screenListRegistry.set(screen.id, screen);
        this.selectedScreen = screen;
        toast.success("Screen updated successfully");
      });
    } catch (error) {
      console.error("Error updating screen:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingScreen = false;
      });
    }
  };

  deleteScreen = async (screenId) => {
    this.isDeletingScreen = true;

    // Ensure screenId is not null, undefined, or empty
    if (!screenId?.trim()) {
      throw new Error("screenId is required and cannot be empty.");
    }

    try {
      await ScreenAPI.delete(screenId, screenId);
      runInAction(() => {
        // remove screen from screen list
        this.screenRegistry.delete(screenId);
        this.screenListRegistry.delete(screenId);

        toast.success("Screen deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting screen:", error);
    } finally {
      runInAction(() => {
        this.isDeletingScreen = false;
      });
    }
  };
}
