import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import ParsedDocApi from "../api/ParsedDocApi";

export default class ParsedDocStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      fetchDocsByTags: action,
      isFetchingDocs: observable,
      docRegistry: observable,
      docListByTags: computed,
      tagIndex: observable,
    });
  }

  // Observables
  isFetchingDocs = false;
  docRegistry = new Map(); // Stores documents indexed by their IDs
  tagIndex = new Map(); // Maps tags to lists of document IDs for fast lookup

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
      runInAction(() => {
        // Update registry and tag index
        docs.forEach((doc) => {
          this.docRegistry.set(doc.id, doc);
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
}
