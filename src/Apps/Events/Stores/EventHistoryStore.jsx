import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import EventHistoryAPI from "../api/EventHistoryAPI";

export default class EventHistoryStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchRecentEvents: action,
      isFetchingRecentEvents: observable,
      mostRecentEvents: computed,

      lastFetchedTime: observable,
      cacheDuration: observable,
      eventRegistry: observable,
    });
  }

  // Observables

  eventRegistry = new Map();
  isEventRegistryCacheValid = false;

  isFetchingRecentEvents = false;

  cacheDuration = 30 * 60 * 1000; // 5 minutes in milliseconds
  lastFetchedTime = null; // Keep track of when the data was last fetched

  // Actions

  fetchRecentEvents = async (inValidateCache = false) => {
    this.isFetchingRecentEvents = true;

    if (inValidateCache) {
      this.isEventRegistryCacheValid = false;
    }

    const currentTime = new Date().getTime();
    if (
      !inValidateCache &&
      this.lastFetchedTime &&
      currentTime - this.lastFetchedTime < this.cacheDuration
    ) {
      this.isFetchingRecentEvents = false;
      return; // Cache is valid, no need to refetch
    }
    try {
      const events = await EventHistoryAPI.getMostRecent(inValidateCache);

      runInAction(() => {
        events.forEach((ev) => {
          this.eventRegistry.set(ev.id, ev);
        });
        this.isEventRegistryCacheValid = true;
        this.lastFetchedTime = currentTime;
      });
    } catch (error) {
      console.error("Error fetching most recent events:", error);
    } finally {
      runInAction(() => {
        this.isFetchingRecentEvents = false;
      });
    }
  };

  get mostRecentEvents() {
    // Return most recent events sorted by dateCreated
    return Array.from(this.eventRegistry.values()).sort(
      (a, b) => b.timeStamp - a.timeStamp
    );
  }
}
