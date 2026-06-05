import axios from "axios";
import { AxiosConfig } from "../../../../config/axiosConfig";
import AppUserManager from "../../../../Auth/components/AppUserManager";

// ─────────────────────────────────────────────────────────────────────────────
// TARGET NOMINATION API
// ─────────────────────────────────────────────────────────────────────────────
// All endpoints below are pending backend implementation.
// Until they are live, every call throws and the store falls back to mock data
// (see TargetNominationStore.jsx for the fallback shapes).
//
// BASE URL: /v2/target
// Auth: Bearer token via SSO (Authorization header injected automatically).
//
// ── ENDPOINT CONTRACTS ───────────────────────────────────────────────────────
//
// GET /v2/target/cohorts
//   Response: string[]
//   Example:  ["Nov 2023", "Nov 2024"]
//
// GET /v2/target/nominations?cohort=<cohort>
//   Response: NominationRecord[]
//   NominationRecord {
//     id:        string          — matches the target's id in targetStore
//     name:      string          — short gene name, e.g. "ArgB"
//     fullName:  string          — full descriptive name
//     pathway:   string          — pathway group label, e.g. "Amino acid biosynthesis"
//     isPriority: boolean        — true if target is a priority target of interest
//     events:    EventRecord[]   — full event history for this target (all cohorts)
//   }
//   EventRecord {
//     type:    "nominated" | "retained" | "removed" | "note"
//     cohort:  string   — the cohort this event belongs to, e.g. "Nov 2024"
//     date:    string   — ISO date, e.g. "2024-11-06"
//     reason:  string   — free-text reason/note
//     author:  string   — display name of the user who added the event
//   }
//
// GET /v2/target/:targetId/events
//   Response: EventRecord[]   — same shape as above, newest first
//
// POST /v2/target/:targetId/events
//   Request body: { type, reason, author }   — cohort & date injected by backend
//   Response: EventRecord   — the newly created event (with cohort & date filled in)
//
// GET /v2/target/:targetId/horizon
//   (Used by the Horizon component — see HorizonStore / TargetHorizonAPI for shape)
// ─────────────────────────────────────────────────────────────────────────────

// Silent axios instance — errors fall through to mock fallbacks in the store.
const silent = async (method, url, data) => {
  const ssoUser = await AppUserManager.getUser();
  const headers = {
    ...(AxiosConfig.headers || {}),
    ...(ssoUser?.access_token ? { Authorization: `Bearer ${ssoUser.access_token}` } : {}),
  };
  const response = await axios({ method, url: `${AxiosConfig.baseURL}${url}`, headers, data });
  return response.data;
};

const TargetNominationAPI = {
  getNominationsByCohort: (cohort) =>
    silent("get", `/v2/target/nominations?cohort=${encodeURIComponent(cohort)}`),

  getCohorts: () => silent("get", "/v2/target/cohorts"),

  getTargetEvents: (targetId) =>
    silent("get", `/v2/target/${targetId}/events`),

  getTargetHorizon: (targetId) =>
    silent("get", `/v2/target/${targetId}/horizon`),

  addTargetEvent: (targetId, event) =>
    silent("post", `/v2/target/${targetId}/events`, event),
};

export default TargetNominationAPI;
