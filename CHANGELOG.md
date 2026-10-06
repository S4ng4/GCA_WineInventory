# CHANGELOG

## v2.5 — 2026-10-05
- **Rollback of v2.4**:
  - Removed Gran Caffè L'Aquila custom logo and theme toggle.
  - Reverted UI cleanly to the v2.3 pure iOS Human Interface Guidelines design system.
  - Retained all v2.3 features: Apple system palette, category sequence (Rossi, Bianchi, Bollicine, Rosati, Dolci), Pencil/Check icon button for editing, Title Case normalized wine names, and Google Drive & Sheets integration.

## v2.4 — 2026-10-05
- **Button Proportions Harmonization**:
  - Adjusted all bottom floating toolbar buttons to an exact 48px height (`h-12`), achieving 1:1 proportion with the 48px circular stepper buttons above on an 8pt grid.
- **Gran Caffè L'Aquila Branding & Theme Switcher**:
  - Embedded vector logo for Gran Caffè L'Aquila (golden filigree, Italian flag heart, serif typography, and Philadelphia cursive subtitle).
  - Added dedicated theme selector in the header enabling one-tap switching between the custom **Gran Caffè L'Aquila** edition and the **Original iOS HIG** design.
  - Theme preference is saved locally to remember the user's choice.
- **Comprehensive Email & Report Export**:
  - Enhanced email body to provide both an **Executive Ready-To-Use Report** (with brand header, category breakdowns, grand total bottles, and organized shelf inventory) and a **Raw CSV Spreadsheet Section**.
  - Added in-modal expandable report preview, direct CSV file download (`.csv` with UTF-8 BOM), and dedicated copy buttons for either the report or the CSV data.

## v2.3 — 2026-10-05
- **iOS Palette & Refined Typography**:
  - Refined iOS System Grouped Backgrounds and System Fills for light and dark modes.
  - Normalized all 315 wine names from ALL CAPS to standard Title Case typography while preserving technical acronyms (DOC, DOCG, MGA, RNDC) and vintage/volume designations.
  - Updated category filter order to: **Rossi, Bianchi, Bollicine, Rosati, Dolci**.
  - Replaced the bottom toolbar text button "Modifica / Edit" with an iOS icon button (`Pencil` for editing, `Check` for done).

## v2.2 — 2026-10-05
- **iOS Human Interface Guidelines Pixel-Perfect Polish**:
  - Enforced Apple standard 8pt spacing grid: 32px between sections, 8px from section title to card, 16px from header to content.
  - Implemented exact 0.5px hairline divider styling (`.hairline-b`) with 16px left indentation.
  - Applied Apple typography hierarchy: Large Title (34/41 700), Title 3 (20/25 600), Headline (17/22 600), Subhead (15/20 400), Footnote (13/18 400), Counter (28/32 600 tabular-nums).
  - Added seamless EN/IT language switcher in navigation header to support both English translation and Italian interface.
  - Enhanced bottom sheets with smooth spring slide-up animation and 36x5 grabber handle.

## v2.1 — 2026-10-05
- **Google Drive & Google Sheets Integration**:
  - Configured client-side OAuth with `drive.file`, `drive.readonly`, and `spreadsheets` scopes via Firebase Auth.
  - Added dedicated Google Drive sheet browser and live export modal.
  - Enabled direct export of inventory counts to new or existing Google Spreadsheets in Google Drive formatted with categories, regions, status, and dates.
  - Implemented explicit confirmation dialog prior to Drive export as required for Workspace operations.

## v2.0 — 2026-10-05
- **iOS Human Interface Guidelines Design System**:
  - Implemented Apple system color tokens (`--bg`, `--card`, `--card-2`, `--label`, `--label-2`, `--label-3`, `--separator`, `--fill`, `--blue`, `--green`, `--red`, `--orange`).
  - Added collapsing Large Title ("Wine Inventory") that smoothly transitions into compact centered title with frosted blur backdrop on scroll.
  - Inset Grouped list style with 12px rounded cards, 0.5px hairline dividers with 16px left indentation.
  - Segmented control for macro categories (`All`, `Sparkling`, `Whites`, `Rosés`, `Reds`, `Dessert`) with smooth horizontal scroll and active card elevation.
  - Dynamic Region chips row updating strictly based on the selected category (auto-hidden when < 2 regions).
  - iOS-style UISwitch for "Uncounted only" filter.
  - Stepper controls with 48px circle buttons, smooth tap/hold repeat (450ms initial delay, 90ms repeat), direct numeric entry, and green dot counted indicators.
  - Native iOS bottom sheets with 36x5 grabber handle, rounded top corners, spring animation, and grouped input rows for "Add Wine", "Edit Wine", and "Send Inventory".
  - Floating bottom action bar with frosted blur material and safe-area padding.
- **Complete English Localization**:
  - Translated all UI elements, labels, empty states, toasts, dialogs, and email/CSV exports into English.
  - Wine names preserved verbatim from the authentic "Wine Liquor Order" dataset (315 wines, 56 section blocks).
- **Google Workspace / Drive Preparedness**:
  - Structured data export and sheets synchronization integration capabilities.

---

## Baseline History

| Version | Description |
|---|---|
| **v1.0 — MVP** | First mobile page for shelf counting. Initial list of 59 wines from "Wine_Inventory" sheet (27 by the glass + 32 by bottle), original names and sequence, wine name only. Stepper `−`/`+` with hold-to-repeat, numeric field, uncounted vs zero distinction, search, All/To count/Counted filter, progress bar, auto-save, Wake Lock, vibration. Email export (mailto), Share (CSV), and Copy. |
| **v1.1 — New Database & Filters** | Replaced database with "Wine_Liquor_Order" sheet (315 wines, 56 blocks), sequence preserved verbatim. Wines divided by category → region → group. Added macro filters (Sparkling/Whites/Rosés/Reds/Dessert) and region child filter chips; "To count" switch. Email export with sections, category totals, "only counted" default, 6500-char clipboard fallback. Storage key `inv-vini-v2`. |
| **v1.2 — List Management & Fixes** | Added new wine creation (`+ Wine`) with proper group positioning, rename and double-tap deletion, restore removed wines, `Edit` mode. Stable IDs. **Fix**: touched wines stay visible while "To count" is active (`keep` rule). Double-tap counter reset, removed unsafe `confirm()` dialogs for sandboxed iframes. |
