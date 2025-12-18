# Overview
DAIKON is an AI-enabled drug discovery platform designed to manage, integrate, and accelerate TB drug discovery across distributed research organizations. It supports the full lifecycle from **target ideation → screening → hit assessment → portfolio → post-portfolio**, combining experimental data, chemical intelligence, structural biology, and AI-driven knowledge extraction into a single system of record. 
Since its original conception as a target screening database, DAIKON has evolved into a AI research platform supporting 100K+ compounds, and multiple concurrent discovery programs for both target and phenotypic-based screening workflows.

> This repository documents and supports **DAIKON**, the official drug discovery platform developed and used by the TBDA consortium.  
> The public-facing overview of the platform is available at: https://saclab.github.io/daikon/. This user guide provides a high-level overview of the platform’s purpose and capabilities.

This repository focuses on:
- Product scope and decision rationale
- Platform capabilities and constraints
- Consortium-specific workflows and governance
- Configuration and implementation details

# Vision
DAIKON will function as an AI-augmented decision-support platform that assists scientists and researchers by surfacing insights, risks, and historical context while preserving human judgment and guide them to:

- Systematically evaluate and prioritize biological targets
- Rapidly assess chemical quality, liability, and novelty
- Integrate AI predictions directly into experimental decision-making
- Preserve institutional knowledge across years of discovery

# Scope
**What DAIKON does:**

DAIKON provides an integrated platform that:
•	Captures screening operations across labs and collaborators
•	Manages hits, chemical series, and progression decisions
•	Enforces compound disclosure workflows and ownership tracking
•	Provides core cheminformatics capabilities, including structure storage, property calculation, and visualization
•	Integrates AI-based nuisance detection to flag aggregators, reactive, luciferase inhibitors, and promiscuous molecules
•	Acts as a knowledge repository through doc summarization, tagging and search
•	Maintains project and portfolio lineage from target inception through horizon and timeline views
These capabilities are linked longitudinally across time, around:
•	targets
•	compounds
•	decisions
•	outcomes
This linkage preserves historical accuracy and enables continuity of scientific and portfolio context as discovery programs mature.<img width="468" height="68" alt="image" src="https://github.com/user-attachments/assets/a6ddcb6b-153d-4b99-9852-5d896620db86" />

**What DAIKON does NOT:**
DAIKON explicitly does not aim to:
•	Replace wet-lab execution systems (ELNs, LIMS, assay automation tools)
•	Function as a standalone chemistry calculation engine or simulation platform
•	Serve as a generic document management or collaboration tool
•	Act as an autonomous AI discovery engine that replaces scientific judgment
•	Optimize laboratory throughput, scheduling, or experiment execution
•	Expand into late-stage clinical development or regulatory systems
DAIKON is designed to support decision-making, not to execute experiments, replace domain expertise, or automate discovery end-to-end.

# Target Users
This repository is intended for TBDA consortium members, collaborators, and reviewers evaluating the platform’s product design and implementation.

# Primary and Exclusive Users
TBDA Consortium Members, including:
- Medicinal chemists
- Structural biologists
- Target program leads and Principal investigators
- Screening and assay scientists
- Computational chemists
- AI and data science contributors
- Bioinformaticians
- Program and portfolio leads
These users operate across academic labs, pharmaceutical companies, biotech partners, and non-profit organizations within the TBDA consortium and collaborate on shared TB drug discovery programs.

# User Environment and Constraints
TBDA consortium members:
- Work with mixed proprietary and shared data
- Generate high-volume experimental, structural, and chemical datasets
- Operate across multiple institutions with different tooling standards
- Require traceability, auditability, and disclosure control
- Need AI systems that augment expert judgment, not replace it

DAIKON is designed to augment expert workflows, preserve institutional knowledge, and reduce friction across organizational boundaries.

# Core Product Capabilities
**1. Discovery Data Capture and Organization**
DAIKON acts as the system of record for discovery data, enabling structured capture and retrieval of:
- Targets, genes, and biological context
- Phenotypic and target-based screens
- Hits, hit assessments, and compound series
- Assay metadata and experimental outcomes
All data is organized around biologically meaningful entities rather than isolated files, enabling longitudinal analysis and reuse.

**2. Dual-Mode Discovery Support**
- Target-based workflows: target prioritization, biochemical screens, structure-guided hit assessment
-Phenotypic workflows: whole-cell screens, phenotypic hit triage, resistance and validation data
The platform preserves traceability as programs transition between phenotypic discovery and validated targets, avoiding artificial silos.

**3. Project, Screen, and Pipeline Management**
DAIKON provides structured pipeline views that reflect real discovery stages:
- Targets → Screens → Hit Assessment → Portfolio → Post-Portfolio
- Dedicated landing pages per stage
- Horizon and timeline views for longitudinal tracking
- Visual indicators for stalled or inactive screens
These views enable teams to monitor progress, identify bottlenecks, and maintain shared situational awareness across organizations.

**4. Collaboration and Activity Tracking**
DAIKON includes built-in collaboration features:
- Activity feeds showing recent updates and changes
- Discussion threads linked to targets, screens, and projects
- Contextual visibility into who changed what and when
This ensures decisions and rationale remain visible and auditable across the consortium.

**5. Chemical Intelligence via MolecuLogix**
DAIKON integrates MolecuLogix as its chemical intelligence layer, enabling:
- Storage and visualization of chemical structures
- Substructure and similarity searches
- Automated calculation of physicochemical properties
- Compound–target–project associations
- Reverse lookup from molecule to biological context
This provides medicinal chemists with direct chemical context inside discovery workflows.

**6. AI-Enabled Compound Quality Assessment**
DAIKON integrates AI models directly into compound workflows to:
- Automatically flag nuisance compounds (aggregators, reactive compounds, luciferase inhibitors, promiscuous molecules)
- Surface risk signals early in hit assessment
- Support expert review rather than automate decisions
AI outputs are transparent and designed to augment scientific judgment.

**7. Knowledge Management and Retention**
DAIKON functions as a long-term knowledge repository by:
- Extracting and summarizing information from large document collections
- Tagging and linking insights to targets, compounds, and projects
- Preserving historical rationale behind prioritization and progression decisions
This prevents loss of institutional memory across multi-year discovery programs.

**8. Secure, Consortium-Scale Deployment**
DAIKON supports:
- On-premise or cloud deployment
- Enterprise authentication (e.g., Active Directory / SSO)
- Access control aligned with consortium governance
This enables secure collaboration across academic, pharma, biotech, and non-profit partners.

## Configuration 
Configuration must be placed in
src/config.js
Example

```
export const appConfig = {
  REACT_APP_MSAL_CLIENT_ID: "",
  REACT_APP_WEB_API_BASE_URI: "",
  REACT_APP_MSAL_CLIENT_SCOPE: "",
  REACT_APP_MSAL_TENANT_AUTHORITY_URI: "",
  REACT_APP_MSAL_CACHE_LOCATION: "",
  REACT_APP_MSAL_AUTH_STATE_IN_COOKIE: "",
  REACT_APP_MSAL_LOGIN_REDIRECT_URI: "",
};
```
