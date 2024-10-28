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

      updateTargetAssociation: action,
      renameScreen: action,

      getFilterAttributes: action,
      filterCriteria: observable,
      setFilterCriteria: action,

      getFilteredListTargetBased: computed,
    });
  }

  // Observables
  isFetchingScreens = false;
  isScreenListCacheValid = false;
  screenListRegistry = new Map();

  isFetchingScreen = false;
  screenRegistry = new Map();
  isScreenRegistryCacheValid = false;
  selectedScreen = null;

  isUpdatingScreen = false;
  isAddingScreen = false;
  isDeletingScreen = false;

  filterCriteria = {
    targets: [],
    primaryOrgAliases: [],
    methods: [],
    dateRange: [null, null],
  };

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
    let screens = Array.from(this.screenListRegistry.values());
    runInAction(() => {
      screens.map((screen) => {
        screen.primaryOrgAlias =
          this.rootStore.authStore.appVars.orgsAlias[screen.primaryOrgId];
      });
    });
    return screens;
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

        // FLatten the associated targets, separate by comma
        if (screen.associatedTargets) {
          screen.associatedTargetsFlattened = Object.values(
            screen.associatedTargets
          ).join(", ");
        }

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

  updateTargetAssociation = async (screen) => {
    this.isUpdatingScreen = true;

    try {
      await ScreenAPI.updateAssociatedTargets(screen);
      runInAction(() => {
        // update in screen registry list
        this.screenRegistry.set(screen.id, screen);
        this.screenListRegistry.set(screen.id, screen);
        this.selectedScreen = screen;
        toast.success("Screen target association updated successfully");
      });
    } catch (error) {
      console.error("Error updating screen:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingScreen = false;
      });
    }
  };

  renameScreen = async (screen) => {
    this.isUpdatingScreen = true;

    try {
      await ScreenAPI.rename(screen);
      runInAction(() => {
        // update in screen registry list
        this.screenRegistry.set(screen.id, screen);
        this.screenListRegistry.set(screen.id, screen);
        this.selectedScreen = screen;
        toast.success("Screen renamed successfully");
      });
    } catch (error) {
      console.error("Error updating screen:", error);
    } finally {
      runInAction(() => {
        this.isUpdatingScreen = false;
      });
    }
  };

  getFilterAttributes = () => {
    return {
      primaryOrgAliases: Array.from(
        new Set(
          Array.from(this.screenListRegistry.values())
            .map((screen) => screen.primaryOrgAlias)
            .filter((alias) => alias && alias.trim() !== "")
        )
      ).sort(),

      methods: Array.from(
        new Set(
          Array.from(this.screenListRegistry.values())
            .map((screen) => screen.method)
            .filter((method) => method && method.trim() !== "")
        )
      ).sort(),

      targets: Array.from(
        new Set(
          Array.from(this.screenListRegistry.values())
            .flatMap(
              (screen) => screen.associatedTargetsFlattened?.split(", ") || []
            )
            .filter((target) => target && target.trim() !== "")
        )
      ).sort(),
    };
  };

  setFilterCriteria = (criteria) => {
    console.log("Default filter criteria:", this.filterCriteria);
    runInAction(() => {
      console.log("Setting filter criteria:", criteria);
      this.filterCriteria = {
        ...this.filterCriteria,
        ...criteria,
      };
    });
  };

  get getFilteredListTargetBased() {
    const { targets, primaryOrgAliases, methods, dateRange } =
      this.filterCriteria;

    return Array.from(this.screenListTargetBased).filter((screen) => {
      // Filter by targets
      const matchesTargets =
        !targets.length ||
        targets.some((target) =>
          screen.associatedTargetsFlattened
            ?.toLowerCase()
            .includes(target.toLowerCase())
        );

      // Filter by primaryOrgAliases
      const matchesPrimaryOrgAliases =
        !primaryOrgAliases.length ||
        primaryOrgAliases.includes(screen.primaryOrgAlias);

      // Filter by methods
      const matchesMethods = !methods.length || methods.includes(screen.method);

      // Filter by date range
      const matchesDateRange =
        (!dateRange[0] ||
          new Date(screen.dateCreated) >= new Date(dateRange[0])) &&
        (!dateRange[1] ||
          new Date(screen.dateCreated) <= new Date(dateRange[1]));

      // Return true if all criteria match
      return (
        matchesTargets &&
        matchesPrimaryOrgAliases &&
        matchesMethods &&
        matchesDateRange
      );
    });
  }
}
