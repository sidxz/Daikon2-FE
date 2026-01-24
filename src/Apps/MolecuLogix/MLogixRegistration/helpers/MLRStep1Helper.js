export const normalize = (s) => (s ?? "").toString().trim();

export const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export const enrichRowFactory = ({
  normalizeFn = normalize,
  metaDataScientist,
  metaDataOrgID,
  fuzzyMatchOrgByName,
}) => {
  return (r) => {
    const row = { ...r };

    if (!normalizeFn(row.disclosureScientist)) {
      row.disclosureScientist = metaDataScientist;
    }

    if (normalizeFn(row.disclosureOrg)) {
      const res = fuzzyMatchOrgByName?.(row.disclosureOrg);
      if (res?.id) row.disclosureOrgId = res.id;
    }

    if (!normalizeFn(row.disclosureOrgId)) {
      row.disclosureOrgId = metaDataOrgID;
    }

    return row;
  };
};

export const processInChunks = async ({
  rows,
  chunkSize = 1000,
  normalizeFn = normalize,
  enrichRow,
  setBusy,
  setProgress,
  setProgressMsg,
  setTotalRows,
  setDataProcessed,
  onDataReady,
}) => {
  setBusy?.(true);
  setProgress?.(0);
  setProgressMsg?.("Preparing data…");
  setTotalRows?.(rows.length);

  const total = rows.length;

  // fast filter pass
  const filtered = rows.filter((r) => normalizeFn(r.name));

  const cleaned = [];
  for (let i = 0; i < filtered.length; i += chunkSize) {
    const chunk = filtered.slice(i, i + chunkSize);

    cleaned.push(...chunk.map(enrichRow));

    // yield to UI
    await sleep(0);

    const pct = Math.round(((i + chunk.length) / Math.max(1, total)) * 100);
    setProgress?.(pct);
    setProgressMsg?.(
      `Processed ${Math.min(i + chunk.length, total)} of ${total} rows`,
    );
  }

  // assign __rid sequentially
  let rid = 0;
  const withIds = cleaned.map((row) => ({ __rid: ++rid, ...row }));

  setProgressMsg?.("Finalizing…");
  setDataProcessed?.(withIds);
  onDataReady?.(withIds);
  setBusy?.(false);

  return withIds;
};

export const dedupeByName = (rows) => {
  const seen = new Set();
  const deduped = [];

  for (const r of rows) {
    const key = normalize(r?.name).toLowerCase();
    if (!key) continue; // skip empty names
    if (seen.has(key)) continue; // drop duplicate
    seen.add(key);
    deduped.push(r);
  }

  return deduped;
};
