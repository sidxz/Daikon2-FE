import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { toast } from "react-toastify";
import { ExtractTrackedFieldsFromHistory } from "../../../Shared/VersionTracker/ExtractTrackedFieldsFromHistory";
import ParsedDocApi from "../api/ParsedDocApi";

export default class ParsedDocStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchDocsByTags: action,
      editDoc: action,
      isEditingDoc: observable,
      isFetchingDocs: observable,
      docRegistry: observable,
      docRevisionRegistry: observable,
      docListByTags: computed,
      tagIndex: observable,
    });
  }

  // Observables
  isFetchingDocs = false;
  isEditingDoc = false;
  docRegistry = new Map(); // Stores documents indexed by their IDs
  tagIndex = new Map(); // Maps tags to lists of document IDs for fast lookup
  docRevisionRegistry = new Map(); // Maps document IDs to their revision history
  isFetchingDocRevisions = false;

  /**
   * Fetch documents by tags
   * @param {string[]} tags - Tags to query
   * @param {boolean} inValidateCache - Force a refresh if true
   */
  fetchDocsByTags = async (tags, inValidateCache = false) => {
    const tagKey = tags.sort().join(","); // Consistent key for tag combinations
    if (!inValidateCache && this.tagIndex.has(tagKey)) {
      // Cache hit: Documents are already fetched
      return;
    }

    this.isFetchingDocs = true;
    try {
      const docs = await ParsedDocApi.listByTags(tags);
      const histories = await Promise.all(
        docs.map((doc) => ParsedDocApi.getRevisionHistory(doc.id))
      );
      const trackedFields = [
        "Title",
        "Authors",
        "ShortSummary",
        "Notes",
        "CreatedById",
        "LastModifiedById",
      ];
      runInAction(() => {
        // Update registry and tag index
        docs.forEach((doc, index) => {
          this.docRegistry.set(doc.id, doc);
          let formattedDocHistory = ExtractTrackedFieldsFromHistory(
            histories[index],
            trackedFields
          );
          this.docRevisionRegistry.set(doc.id, formattedDocHistory);

          doc.tags.forEach((tag) => {
            if (!this.tagIndex.has(tag)) {
              this.tagIndex.set(tag, []);
            }
            if (!this.tagIndex.get(tag).includes(doc.id)) {
              this.tagIndex.get(tag).push(doc.id);
            }
          });
        });

        // Index the current tag query
        this.tagIndex.set(
          tagKey,
          docs.map((doc) => doc.id)
        );
      });
    } catch (error) {
      console.error("Error fetching documents by tags:", error);
    } finally {
      runInAction(() => {
        this.isFetchingDocs = false;
      });
    }
  };

  /**
   * Computed: Get a list of documents by tags
   * @param {string[]} tags - Tags to filter by
   * @returns {Array} Filtered documents
   */
  get docListByTags() {
    return (tags) => {
      const tagKey = tags.sort().join(",");
      const docIds = this.tagIndex.get(tagKey) || [];
      return docIds.map((id) => this.docRegistry.get(id)).filter(Boolean);
    };
  }

  editDoc = async (docId, data) => {
    console.log("Editing document:", docId, data);
    if (!docId) {
      console.error("Document ID is not set");
      return;
    }
    data.id = docId;
    this.isEditingDoc = true;

    try {
      await ParsedDocApi.editDoc(data); // Only perform the update

      // Refetch the updated document and its revision history
      const updatedDoc = await ParsedDocApi.getById(docId);
      const history = await ParsedDocApi.getRevisionHistory(docId);
      const trackedFields = [
        "Title",
        "Authors",
        "ShortSummary",
        "Notes",
        "CreatedById",
        "LastModifiedById",
      ];
      const formattedDocHistory = ExtractTrackedFieldsFromHistory(
        history,
        trackedFields
      );

      runInAction(() => {
        this.docRegistry.set(docId, updatedDoc);
        this.docRevisionRegistry.set(docId, formattedDocHistory);
        toast.success("Document updated successfully");
      });
    } catch (error) {
      console.error("Error editing or refetching document:", error);
    } finally {
      runInAction(() => {
        this.isEditingDoc = false;
      });
    }
  };
}
