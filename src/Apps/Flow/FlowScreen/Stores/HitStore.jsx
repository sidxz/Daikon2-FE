// import { action, makeObservable, observable, runInAction } from "mobx";
// import { toast } from "react-toastify";
// import HitAPI from "../api/HitAPI";

// export default class HitStore {
//   rootStore;

//   constructor(rootStore) {
//     this.rootStore = rootStore;
//     makeObservable(this, {
//       isUpdatingHit: observable,
//       updateHit: action,

//       isAddingHit: observable,
//       addHit: action,

//       isDeletingHit: observable,
//       deleteHit: action,
//     });
//   }

//   // Observables
//   isUpdatingHit = false;
//   isAddingHit = false;
//   isDeletingHit = false;

//   // Actions
//   addHit = async (hit) => {
//     this.isAddingHit = true;

//     // Ensure hit.hitCollectionId is set ,error out if not
//     if (!hit.hitCollectionId?.trim()) {
//       throw new Error("hitCollectionId is required and cannot be empty.");
//     }

//     try {
//       var res = await HitAPI.create(hit);
//       runInAction(() => {
//         // Add hit to hit list
//         console.log(res);
//         hit.id = res.id;

//         console.log("Add with id hit:", hit);
//         this.rootStore.screenStore.selectedScreen.hits.push(
//           hit
//         );
//         const screen = this.rootStore.screenStore.screenRegistry.get(
//           hit.hitCollectionId
//         );
//         screen.hits.push(hit);

//         toast.success("Hit Collection added successfully");
//       });
//     } catch (error) {
//       console.error("Error adding Hit Collection:", error);
//     } finally {
//       runInAction(() => {
//         this.isAddingHit = false;
//       });
//     }
//   };

//   updateHit = async (hit) => {
//     console.log("updateHit:", hit);
//     this.isUpdatingHit = true;

//     // Ensure hit.hitCollectionId is set, fallback to selectedScreen.hitCollectionId if null, undefined, or empty
//     hit.hitCollectionId =
//       hit.hitCollectionId?.trim() ||
//       this.rootStore.screenStore.selectedScreen.id;

//     // Ensure hit.hitId is not null, undefined, or empty
//     if (!hit.id?.trim()) {
//       throw new Error("hitId is required and cannot be empty.");
//     }

//     try {
//       await HitAPI.update(hit);
//       runInAction(() => {
//         // update in screen registry list
//         const screen = this.rootStore.screenStore.screenRegistry.get(
//           hit.hitCollectionId
//         );

//         const indexOfEss = screen.hits.findIndex(
//           (e) => e.id === hit.id
//         );
//         screen.hits[indexOfEss] = hit;

//         // update the same in selected screen
//         const selectedScreen = this.rootStore.screenStore.selectedScreen;
//         const selectedIndex = selectedScreen.hits.findIndex(
//           (e) => e.id === hit.id
//         );

//         selectedScreen.hits[selectedIndex] = hit;

//         toast.success("Gene hit updated successfully");
//       });
//     } catch (error) {
//       console.error("Error updating screen hit:", error);
//     } finally {
//       runInAction(() => {
//         this.isUpdatingHit = false;
//       });
//     }
//   };

//   deleteHit = async (hitId) => {
//     this.isDeletingHit = true;

//     const hitCollectionId = this.rootStore.screenStore.selectedScreen.id;

//     // Ensure hitId is not null, undefined, or empty
//     if (!hitId?.trim()) {
//       throw new Error("hitId is required and cannot be empty.");
//     }

//     try {
//       await HitAPI.delete(hitCollectionId, hitId);
//       runInAction(() => {
//         // remove hit from screen hit list
//         const screen = this.rootStore.screenStore.screenRegistry.get(hitCollectionId);
//         const indexOfEss = screen.hits.findIndex(
//           (e) => e.id === hitId
//         );
//         screen.hits.splice(indexOfEss, 1);

//         // remove the same from selected screen
//         const selectedScreen = this.rootStore.screenStore.selectedScreen;
//         const selectedIndex = selectedScreen.hits.findIndex(
//           (e) => e.id === hitId
//         );
//         selectedScreen.hits.splice(selectedIndex, 1);

//         toast.success("Gene hit deleted successfully");
//       });
//     } catch (error) {
//       console.error("Error deleting screen hit:", error);
//     } finally {
//       runInAction(() => {
//         this.isDeletingHit = false;
//       });
//     }
//   };
// }
