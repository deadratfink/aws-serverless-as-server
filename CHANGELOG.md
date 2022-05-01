## Changelog

### v1.2.8

- Documentation extended and improved:
  - Unit test coverage added.
- Make target `outdated` implemented by `npm outdated`, `outdated` removed in _package.json_'s `scripts` section.
- Make target `clean` expanded by: `rm -f package-lock.json`.
- Removal of `@types/terser-webpack-plugin`.

### v1.2.7

- Patch Day 2010-11-23: libs updated.
- Docs slightly improved.
- Image links corrected in docs.

### v1.2.6

- [[SST-158](https://jira.veolia.de/browse/SST-158)] Compodoc documentation created.
- Fix and refactor manual GraphQL schema generation code and targets.
- Unused interface `IOrganizationReferenceResult` removed.
- Doubled interface `IMaterial` corrected.
- Whole api-docs reworked and partly corrected.
- Renamed internal interface `IZoneIdsToOrganizationIds` to `IZoneIdsToOrganizationId`.
- Renamed internal function `mapSubstanceGroupToContainerMaterialGroupColumnName` to `mapSubstanceGroupToContainerMaterialGroupName`.
- Some other small code/template cleanups.

### v1.2.5

- Update end to end tests.

### v1.2.4

- [Patch Day 2021-10-26](https://jira.veolia.de/browse/SST-290)
- Not updated:
  - apollo-server ~2.24.0 → ~3.4.0
  - eslint ~7.32.0 → ~8.1.0
  - apollo-server-lambda ~2.24.0 → ~3.4.0
  - node-fetch ~2.6.1 → ~3.0.0

### v1.2.3

- Create google chat room foreach stage.

### v1.1.2

- [Patch Day 2021-09-28](https://jira.veolia.de/browse/SST-235)
- Not updated:
  - @types/jest ~27.0.1 → ~27.0.2
  - apollo-server ~2.24.0 → ~3.3.0
  - apollo-server-lambda ~2.24.0 → ~3.3.0
  - eslint-plugin-jest ~24.4.0 → ~24.4.2
  - jest ~26.6.3 → ~27.2.3
  - node-fetch ~2.6.1 → ~3.0.0
  - ts-jest ~26.5.6 → ~27.0.5
- New variable STAGE in envs

### v1.1.1

- [Patch Day 2021-08-24](https://jira.veolia.de/browse/SST-94)
- Not updated
  - apollo-server ~2.24.0 → ~3.3.0
  - jest ~26.6.3 → ~27.1.0
  - ts-jest ~26.5.6 → ~27.0.5
  - apollo-server-lambda ~2.24.0 → ~3.3.0
  - node-fetch ~2.6.1 → ~3.0.0
- [Options from npm-utils implemented](https://jira.veolia.de/browse/SST-49)

### v1.1.0

- Dotenv implemented
- Some improvements.

### v1.0.2

- Template fixes for Cognito.
- Some other fixes.

### v1.0.1

- Webpack implemented.
- Packages updated.
- Some fixes for updated packages.

### v1.0.0

- Initial implementation.
