import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../../api/agent";

/**
 * A store to manage hits data and its operations.
 */
export default class HitsStore {
  /**
   * A reference to the root store.
   * @type {Object}
   */
  rootStore;

  /**
   * Status of whether a new hit is currently being posted.
   * @type {boolean}
   */
  isCreatingHit = false;

  /**
   * Status of whether a hit is currently being updated.
   * @type {boolean}
   */
  isUpdatingHit = false;

  /**
   * Status of whether a batch insert of hits is currently being performed.
   * @type {boolean}
   * @default false
   */
  isBatchInsertingHits = false;

  /**
   * Constructor for the HitsStore class.
   * @param {Object} rootStore - The root store.
   */
  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isCreatingHit: observable,
      createHit: action,

      isUpdatingHit: observable,
      updateHit: action,

      isBatchInsertingHits: observable,
      batchInsertHits: action,
    });
  }

  /**
   * Create a new hit by posting to the server.
   * @param {Object} hit - The hit to create.
   * @return {Object} The response from the server. | CREATE |
   */
  createHit = async (hit) => {
    console.log("Creating hit");
    console.log(hit);

    this.isCreatingHit = true;

    let response = null;

    try {
      // Send hit to server for creation
      response = await agent.Hit.create(hit);
      runInAction(() => {
        // Additional actions after hit creation can be added here.
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isCreatingHit = false;
      });
    }
    return response;
  };

  /**
   * Update a hit by sending to the server.
   * @param {Object} hit - The hit to update.
   * @return {Object} The response from the server. | UPDATE |
   */
  updateHit = async (hit) => {
    this.isUpdatingHit = true;

    let response = null;

    try {
      // cast clusterGroupId from string to int if type is string, set to 0 if null or undefined
      if (hit.clusterGroup) {
        hit.clusterGroup = parseInt(hit.clusterGroup);
      } else {
        hit.clusterGroup = 0;
      }
      console.log("Updating hit");
      console.log(hit);

      // Send hit to server for update
      response = await agent.Hit.update(hit.Id, hit);
      runInAction(() => {
        // Additional actions after hit update can be added here.
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.isUpdatingHit = false;
      });
    }
    return response;
  };

  /**
   * Batch insert a hits
   * Adds new if ExternalCompoundId is null, updates if ExternalCompoundId is not null.
   * @param {object} editedHitRows - The details of the hit rows to edit.
   */
  batchInsertHits = async (editedHitRows) => {
    console.log("Batch inserting hits");
    console.log(editedHitRows);
    this.isBatchInsertingHits = true;

    try {
      const promises = editedHitRows.map(async (editedHitRow) => {
        if (editedHitRow.status === "New") {
          return await this.createHit(editedHitRow);
        } else if (editedHitRow.status === "Modified") {
          return await this.updateHit(editedHitRow);
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
