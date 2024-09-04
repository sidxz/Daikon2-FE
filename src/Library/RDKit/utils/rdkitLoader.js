// rdkitLoader.js
let rdkitPromise = null;

export const loadRDKit = () => {
  if (!rdkitPromise) {
    rdkitPromise = window
      .initRDKitModule({
        locateFile: () => "/rdkit/RDKit_minimal.wasm", // Path to the .wasm file in public
      })
      .catch((error) => {
        console.error("Failed to load RDKit.js:", error);
        rdkitPromise = null; // Reset the promise in case of failure
      });
  }
  return rdkitPromise;
};
