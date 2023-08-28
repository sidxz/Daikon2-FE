# Change Log


## [v1.4.1]

   ### Fixed
- Phenotypic screens can be created by the screener working group (Permission added)

## [v1.4.0]

### Added

- Created target promotion editable version for admin.
- Updated target promotion questions & calculated fields as per the latest questionnaire.
- Updated Scorecard values.
- Changed drop downs to include descriptive text in the target promotion questionnaire.
- Changed the Confidentiality Agreement text.
- Implemented 'Import' and 'Export' Excel functionality for Target-Based screens, enabling seamless data transfer.
- Added a download template feature for the tables in Screen component for both target-based and phenotypic.
- Added validated hit count column in Screen component.
- Removed primary hit count column from Phenotypic screen component
- Renamed the Screen tab name as "TargetName-SequenceNo-MethodName".
- Updated the landing page What's New section to include the latest feature additions

  ### Fixed
- Bug Fix: Scorecard hover works now.
## [v1.3.0]

### Added

- Updated core libraries and packages and refactored the UI for improved performance.
- Added a new multi-variable Status column in the Screens component to track the progress of screens. The status options include 'Planned', 'Assay Development', 'Ongoing', 'Voting Ready', and 'Completed'.
- Revamped the Screen Landing Page to showcase all Planned, Active, Voting Ready, and Recently Completed screens for better visibility and accessibility.
- Updated the Phenotypic List Page to display screen names instead of screen tab names, along with the new Status column for easy reference.
- Introduced data cleaning tools that allow users to edit and merge phenotypic screens, enhancing data management capabilities.
- Implemented 'Import' and 'Export' Excel functionality for Phenotypic screens, enabling seamless data transfer.
- Restricted the visibility of the Phenotypic screen component to 'admin' and 'screen' user groups, ensuring appropriate access control.
- Updated the 'Data Restructuring in progress' webpage for the Phenotypic Screen component, making it visible only to 'admin' and 'screen' user groups.
- Restored the Target questionnaire promotion form for Genes, making it accessible exclusively to 'admin' users.
- Replaced the previously displayed undisclosed compounds, represented as benzene ring structures, with the term 'UNDISCLOSED' for enhanced clarity and transparency.

### Fixed
- Bug Fix: Resolved an issue where the success message while promoting to H2L from HA incorrectly displayed 'Promoted to HA' instead of 'Promoted to H2L'.

  
## [v1.2.0]

### Added

- Revamped the Landing Page to showcase the latest discussions and enhanced visual updates.
- Introduced "One-Click Voting" that allows users to bypass the voting confirmation dialog with a single click. 
- Renamed 'New' to 'New Library Screen' in the Screens section.
- Introduced the ability to create HA (Hit Assessment) with basic user permissions.
- Implemented a confidentiality agreement on the home page and footer.
- Provided the option to customize the Login page by overriding the default component.
### Fixed
- Bug Fix: The issue where the phenotypic screen was not opening when viewed from the Horizon view has been resolved.

## [v1.1.0]

### Added

- Compass view now supports Rich Text formatting.
- Ability to hide votes for improved privacy.
- Ability to sort votes for better organization.
- Votes can now be commented on, facilitating more in-depth discussions.
- Introduction of tags for discussions, enabling categorization and organization.
- Ability to filter discussions by specific tags.
- Updated icon for the Horizon view, now featuring a hamburger menu.
- Screens can be sorted by dates for easier navigation.
- New menu bar added to the hit table.
- 'Users' group granted editing privileges for Compound Evolution dates.
- Implemented admin user management improvements.
- Added a self-logout feature for situations when the app cannot connect to the server.
  ### Fixed
- Bug Fix: Project managers can now edit project settings.
- Bug Fix: Horizon view loads successfully from Phenotypic screen to validated hits.
