# Code Reviewer Agent Memory

## Project Structure
- Frontend: `front-sharebnb/src/` — React 18 + Vite + Redux (legacy_createStore) + TypeScript
- Backend: `back-sharebnb/` — Express + MongoDB native driver + Socket.io
- Types: `front-sharebnb/src/types/*.d.ts` and `back-sharebnb/types/`
- Custom hooks: `front-sharebnb/src/customHooks/`
- Store: actions in `store/actions/`, reducers in `store/reducers/`

## Key Conventions
- No semicolons at end of lines in `.ts`/`.tsx` files unless necessary
- Styles go in `src/styles/` (or `src/assets/styles/`), not inline
- HTTP calls via `services/http.service.ts`, never raw Axios or fetch
- New files should be `.ts`/`.tsx`, not `.js`/`.jsx`
- Backend MVC: routes -> controllers -> services -> `getCollection()`

## Recurring Issues Found
- `StayFormData` type declares `lat: number` / `lng: number` but the form is initialized with `null` — type/runtime mismatch that TypeScript does not catch because of how the form is cast
- `Location` type in `stay.d.ts` also declares `lat: number` / `lng: number` (non-nullable), but the autocomplete flow can produce `undefined` for lat/lng
- `out` in `parseComponents` is typed as `any` — should be a proper interface
- `WherePanelProps` uses `onChange: any`, `onComplete: any`, `onAdvance: any` — loose typing
- `Stepper` component is defined inside `StayEditor` function body — causes remounting on every render
- STEPS array is defined inside the render function body — recreated on every render
- Inline styles used in `AutoCompletePanel` error state (`style={{ color: '...' }}`) — violates project style convention
- `toPlace()` is called in `SuggestionItem.toPlace` as a closure that captures `p` at suggestion time — safe but subtle; session token must not be reset before `getDetails` is called

## Import Extension Pattern
- Most `.ts`/`.tsx` imports use `.js` extensions (Vite/ESM resolution convention for this project) — this is intentional, not a bug
- Exception: `AutoCompletePanel.jsx` import in `StayEditor.tsx` uses `.jsx` while the file is `.tsx` — inconsistency

## Authentication Pattern
- JWT in HTTP-only cookies set by backend
- `requireAuth` middleware guards protected routes
- Frontend restores session via `initUser()` reading from `sessionStorage`

## Google Maps Integration
- Loader: `front-sharebnb/src/services/googleMapsLoader.ts` — singleton promise, caches on first load
- New API: `AutocompleteSuggestion.fetchAutocompleteSuggestions` + `Place.fetchFields` (replacing deprecated AutocompleteService/PlacesService)
- Session token managed in `usePlacesAutocomplete` hook via `sessionTokenRef`
- `resetSession()` must be called after `getDetails` completes to close the billing session
