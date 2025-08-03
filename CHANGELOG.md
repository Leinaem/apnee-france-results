# CHANGELOG

## v1.0.0 - UNRELEASED

### Changed

- Add prisma, add POST and GET routes, refacto competition page with SQL.
- Refacto import competition and result.
- Fix any typescript and eslint error, rename variables.
- Refacto Results and Competitions, use SSR, finish results refacto with SQL data.
- Use Layout for results page, split components for ssr, use router for results pages.
- Fix ranking sort, fix syntax and typescript errors.

## v0.12.0 - 2025-06-22

### Added

- Add France championship on ranking filter.

## v0.11.0 - 2025-05-28

### Added

- Add Layer on menu.

## v0.10.3 - 2025-05-25

### Added

- Manage display toggle suggestion on search page.

## v0.10.2 - 2025-05-25

### Fixed

- Fix useEffect dependencies warning.

## v0.10.1 - 2025-05-25

### Fixed

- end search page.

## v0.10.0 - 2025-05-09

### Added

- Added partial `InputText`.
- Added svg-sprite, `SearchIcon` component and CSS for partial `InputText`.
- Added search page, WIP.

## v0.9.4 - 2025-05-05

### Fixed

- Fixed Type for InputCommand.

## v0.9.3 - 2025-05-04

### Added

- Added updateCommand and create function to fix city name on database.

## v0.9.2 - 2025-04-26

### Fix

- Filter 'guest' from rankings by competitors.
- Fix sort for 'guest' on results page.

## v0.9.1 - 2025-04-25

### Fix

- Fix filter display on mobile.

## v0.9.0 - 2025-04-25

### Change

- Rework filter on Rankings page.

## v0.8.1 - 2025-04-24

### Fix

- Fix some apos for build check.

## v0.8.0 - 2025-04-24

### Added

- Added content for Homepage.

## v0.7.4 - 2025-04-20

### Fix

- Some CSS fix on tables.

## v0.7.4 - 2025-04-13

### Fix

- Fixed competition and results pages.

## v0.7.3 - 2025-04-13

### Fix

- Fixed import letter-casing.

## v0.7.2 - 2025-04-13

### Fix

- Fixed some lint and typescript error.
- Fixed all error from lint and typescript to build.

### Added

- Added Prettier, eslint, husky.

## v0.7.1 - 2025-04-09

### Added

- Added ranking page, fonctional version with filter.

## v0.7.0 - 2025-03-26

### Added

- Added ranking page, 1rst version.

## v0.6.2 - 2025-03-23

### Fixed

- Fix sort function to display 00.00 and DSQ correctly.

## v0.6.1 - 2025-03-23

### Added

- Added filterExpression for result request, some refacto, add and fix for result pages.

## v0.6.0 - 2025-03-21

### Added

- Results page, more refacto.
- Starded Results page, some refacto.

## v0.5.0 - 2025-03-15

### Added

- Added import logic for result, work on Layout, scss.
- Added partial `InputSelect`.

### Fixed

- Fix some typescript values.

## v0.4.0 - 2025-03-11

### Added

- Create import logic for competitions, putItem in dynamoDB.

## v0.3.0 - 2025-03-08

### Added

- Added, AWS dependencies, Axios, Uuix, config S3 and Dynamo.

## v0.2.0 - 2025-03-07

### Added

- Added Header, NavBar, Icons, Styles.
- Added Sass with base scss files (mixins, typo, funtion ...).
- Clean initial Next project, added sass, create NavBarComponent.
- Create CHANGELOG.md.

## v0.1.0 - 2025-03-03

### Added

- Initial commit from Create Next App.