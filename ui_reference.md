Dater Admin Panel — Design Direction Guide
Version: 1.0 (extracted from DaterApp/)
Purpose: Single source of truth for visual consistency between the mobile app and the web admin dashboard.
Aesthetic north star: Clean, quiet, editorial — black-and-white first, purple only for brand/premium moments. No loud gradients, no “SaaS dashboard” chrome.

Design Philosophy
The mobile app reads as an Expert’s Room: white surfaces, precise typography, hairline borders, and confident black CTAs. Purple (#5E17EB) is reserved for premium/advanced actions — not for general UI chrome. The admin panel should feel like an extension of Settings + Edit Profile, not a separate product.

Admin panel defaults:

Background: #FFFFFF (primary work area)
Optional page shell tint: #F2EFF3 (matches main tab shell in MainScreenBody.kt) — use sparingly for outer layout only
No Material purple (#6750A4) in UI — it exists in Theme.kt but is not what users see day-to-day
1. Core Typography System
Font families
Role	Family	Weights used	Source
Wordmark / logo
League Gothic Regular
Normal (400)
Type.kt → LeagueGothicRegular
All UI copy
Poppins
Regular (400), Medium (500), SemiBold (600), Bold (700), Light (300), Italic
Type.kt
Web implementation: Load LeagueGothic-Regular + Poppins (400, 500, 600, 700, 300, Italic). Disable browser font scaling in admin (mobile fixes scale at 1.0 in dialogs/sheets).

DATER wordmark / logo
Context	Font	Size	Weight	Letter-spacing	TM mark
Auth / Create account
League Gothic Regular
47px
Normal
0
Poppins Medium 11px, 2px left padding, +3px vertical nudge
Splash
League Gothic Regular
48px
Normal
1.2px
—
Home / Settings header
League Gothic Regular
30px
Normal
0
Poppins Medium 9px
Wordmark text is always “DATER” in all caps.
Logo color: contextual — typically #000000 on white; #FFFFFF on auth imagery overlay.
TM sits top-aligned beside the wordmark, same color as “DATER”.
Heading scale (H1–H6) — mapped from app tokens
The app uses semantic styles, not H-tags. Map as follows for admin:

Admin level	App equivalent	Font	Size	Line height	Weight	Use in admin
H1
AppTypography.heading
Poppins Bold
31px
41px
700
Page titles (e.g. “User Moderation”)
H2
friendsTitle / filterHeading
Poppins Medium
26px
42px / 22px
500
Section heroes, dashboard module titles
H3
ageStepHeading / photoTipsTitle
Poppins Bold / SemiBold
26px
36–42px
700 / 600
Sub-section headers
H4
permissionTitle / gradientOverlayHeadline
Poppins SemiBold
22–27px
26–32px
600
Panel titles, modal headlines
H5
sectionHeading / lifestyleSectionTitle
Poppins Bold / Medium
16px
20–24px
700 / 500
Card headers, table group labels
H6
settingsScrolledScreenTitle / filterHeadingScrolled
Poppins Medium
16px
20px
500
Sticky sub-headers, compact toolbar titles
Letter-spacing convention: Many captions use 1% of font size (e.g. 12px → 0.12px). Apply to helper text and labels in admin tables.

Body, captions, and buttons
Token	Font	Size	Line height	Weight	Color default
Body (primary)
Poppins
15px
24px
400
#000000
Body (compact)
Poppins
14px
20px
400
#000000
Body (Material bodyLarge)
Poppins
16px
24px
400
#1C1B1F
Caption / helper
Poppins Medium
12px
24px
500
see muted palette
Micro caption
Poppins
11px
14–20px
400
#484848
Error text
Poppins Medium
12px
24px
500
#FD1C1C
Primary button label
Poppins Medium
15px
—
500
#FFFFFF on black btn
Continue button label
Poppins Regular
15px
24px
400
#FFFFFF on black btn
Settings nav row
Poppins Medium
15px
20px
500
#000000
2. Color Palette
Material theme tokens (Color.kt / Theme.kt)
These are wired into DaterTheme but most screens override with the semantic palette below.

Token	Hex	Notes
Primary
#6750A4
Material default — avoid in admin UI
On Primary
#FFFFFF
Primary Container
#EADDFF
Secondary
#625B71
Secondary Container
#E8DEF8
Tertiary
#7D5260
Background / Surface
#FFFBFE
Near-white
On Background / On Surface
#1C1B1F
Near-black
Surface Variant
#E7E0EC
On Surface Variant
#49454F
Outline
#79747E
Outline Variant
#CAC4D0
Error (Material)
#BA1A1A
Error Container
#FFDAD6
Semantic colors (what the app actually uses)
Brand & accent
Name	Hex	Usage
Brand purple (primary accent)
#5E17EB
Advanced filters, CTA purple, progress complete, custom tab toolbar
Premium purple
#6E17CC
Premium checkmarks, privacy mode
Dark purple (paired)
#2A0F45
Deep accent (custom tab nav bar)
Story gradient start
#FD0B0B → #52108C
Stories only — not for admin
Verified overlay teal
#186A90 → #2EAAA0
Promo overlays only
Neutrals & surfaces
Name	Hex	Usage
Black
#000000
Primary text, selected chips, primary buttons, active nav
Near-black
#1C1B1F
Checkbox fill, onboarding accents
Dark grey (titles)
#323232
Screen titles (Settings, Filters, Notifications)
Body secondary
#565656
Descriptions, overlay body copy
Muted label
#666666
Step subtitles, secondary labels
Placeholder / hint
#767676
Section labels, edit-profile placeholders
Light muted
#777777
Filter arrows, helper paragraphs
Caption grey
#484848
Character counts, icon tints
Disabled / nav inactive
#A9A9A9
Inactive tab icons, comment placeholder
Input placeholder
#999999
Form field placeholders
White
#FFFFFF
Page background, cards, inputs
Input grey fill
#F6F6F6
Edit-profile grey inputs
Card / slot grey
#F5F5F5
Photo slots, selection cards
Shell background
#F2EFF3
Main tab shell (optional admin outer bg)
Progress inactive
#E3E3E3 / #DEDEDE
Rings, bars
Separator (settings)
#EFEFEF
List dividers
Separator (structural)
#D1D1D1
Card borders, filter rows
Divider (actions)
#E0E0E0
Split action bars, switch track off
Dialog separator
#D6D6D6
Confirm dialogs (0.5px)
Status & feedback
Name	Hex	Usage
App error red
#FD1C1C
Validation borders, error text, likes
Destructive red
#F21111 / #E53935 / #FF4848
Confirm “Yes”, logout, badges
Status red (iOS)
#FF3B30
Account status
Confirm green
#22C55E
Age confirm checkmark
Boost green
#03C03C
Boost icon
Verified blue
#1675F2 / #0D76FF
Verified badge
Link blue
#007AFF
Tappable links in Settings
Text color hierarchy (admin rule)
Primary text: #000000 — titles, values, active rows
Secondary text: #565656 or #666666 — descriptions
Tertiary / labels: #767676 — field labels, table column headers
Placeholder / disabled: #999999 → #A9A9A9
Meta / timestamps: #484848 at 11–12px
3. Component Styling & Geometry
Border radii
Component	Radius	Border
Primary button
28px (pill)
none
Auth buttons
50px (full pill, height 50px)
secondary: 1px white
Form text input
14px
0.8px #484848
Comment / multiline input
14px
0.6px #D1D1D1 (0.8px on error)
Edit-profile grey input
6px
none (filled #F6F6F6)
Profile / selection card
10px
0.7px #D1D1D1
Lifestyle / filter bordered box
12px
0.8px #D1D1D1
Modal / confirm dialog
12px
none
Bottom sheet (top corners)
20px
Material drag handle default
Selection chips / pills
100px (full pill)
1px #D1D1D1 unselected
Square checkbox
2px
0.75px
Tooltip bubble
30px
none
Upload progress bar container
12px
shadow 12px
Admin rule: Use 10px for data cards, 14px for inputs, 28px for buttons, 6px for compact inline fields.

Elevation & shadows
The app is mostly flat. Shadows appear only on floating elements:

Element	Shadow	Notes
Upload progress bar
12px blur, 12px corner radius
White surface
Photo reorder (drag)
Dynamic elevation while dragging
Avoid in admin
Bottom sheet
Material3 default tonal elevation
White container
Cards, lists, tables
No shadow — border-only (#D1D1D1 0.7px)
Admin rule: Prefer 1px borders over box-shadow. If elevation is needed (dropdowns), use a subtle 0 2px 8px rgba(0,0,0,0.06) — never Material’s heavy defaults.

Buttons
Primary (default — PrimaryButton / FormPrimaryButton)
Property	Value
Height
50px
Width
Full width of container (parent sets horizontal padding)
Background
#000000
Text
#FFFFFF, Poppins Regular 15px (buttonContinue) or Medium 15px (button)
Corner radius
28px
Press state
Scale to 0.97, 130ms ease
Disabled
Same colors (no opacity change in code — admin should add 50% opacity for accessibility)
Loading
Three white dots, 6px
Auth primary (on imagery — reference only)
White fill #FFFFFF, black text #000000, height 50px, radius 50px.

Auth secondary (on imagery — reference only)
Transparent fill, 1px white border, white text — not typical for admin.

Overlay / narrow CTA (OverlayNarrowCtaButton)
White fill, black text, height 50px, radius 28px, horizontal padding 24px, vertical content padding 4px. Used on gradient promos — in admin, use for secondary confirmations only.

Destructive confirm (dialog)
Split bar: “Yes” in #F21111, “Cancel” in #000000, Poppins Medium 14px, row height 44px.

Text / link actions
Poppins Medium 14px, #000000 or #007AFF for links. No underline unless legal copy.

Input fields
Standard form field (FormTextField)
State	Border	Background	Text	Placeholder
Default
0.8px #484848
#FFFFFF
#000000, Poppins 15px
#999999
Focused
Same as default (no focus ring change)
#FFFFFF
#000000
—
Error
0.8px #FD1C1C
#FFFFFF
#000000
—
Height: 50px
Padding: 16px horizontal, 12px vertical
Cursor: #000000
Comment-style multiline (WriteCommentScreen)
State	Border	Background	Text	Placeholder
Default
0.6px #D1D1D1
#FFFFFF
Poppins Medium 14px / 20px #000000
Poppins 13px #A9A9A9
Error
0.8px #FD1C1C
#FFFFFF
same
—
Min height: 140px
Inner padding: 12px
Character counter: 11px #484848, right-aligned
Admin rule: Use standard form styling for single-line admin fields; use comment styling for notes/moderation reason text areas.

Grey filled input (edit-profile pattern)
Background #F6F6F6, radius 6px, no visible border, black text.

Chips / tags
State	Background	Border	Text
Unselected
#FFFFFF
1px #D1D1D1
#000000, Poppins 13–14px
Selected
#000000
none
#FFFFFF
Padding
12px × 6px
Gap between chips: 8px
Advanced filter accent label text color: #5E17EB (title only, not chip fill).

Cards & containers
Profile card pattern:
  background: #FFFFFF
  border: 0.7px solid #D1D1D1
  border-radius: 10px
  no shadow
Settings list rows: no card wrapper — 1.2px #EFEFEF dividers with 16px horizontal inset.

Bottom sheets
Top corner radius: 20px
Container: white
Uses Material3 ModalBottomSheet defaults for scrim and drag handle
Horizontal padding in filter flows: 24px
Primary CTA pinned bottom: 16px horizontal, 9px below button
Dialogs (DeleteStoryConfirmDialog pattern)
Outer margin: 32px horizontal
Container: white, 12px radius
Message: Poppins Medium 14px / 21px, centered, #000000
Separator: 0.5px #D6D6D6
Action row: 44px tall, 50/50 split with vertical divider
Toggles (SettingsStyleSwitch)
State	Track	Thumb
Off
#E0E0E0
#FFFFFF
On
#000000
#FFFFFF
Effective track width 28px (scaled from 38×18 baseline). Use for admin boolean settings.

Bottom navigation (mobile reference → admin sidebar)
State	Icon / label color
Active
#000000
Inactive
#A9A9A9
Background: #FFFFFF, top padding 4px, bottom 16px + safe area.

4. Spacing & Layout Rules
Core spacing scale (from LayoutConstants.kt and screen patterns)
Token	Value	Usage
xs
4px
Gap above primary CTA, tight stacks
sm
8px
Content vertical padding, chip gaps, icon-to-label
md
12px
Row internal padding, section gaps
base
16px
Standard horizontal padding (screenHorizontalPadding), comment field sides
lg
20px
Section spacing (filters, lifestyle), dialog-adjacent gaps
xl
24px
Form flow horizontal padding, filter screen padding
2xl
36px
Screen header top padding
CTA bottom
9px
Space below primary buttons
Auth bottom
20px
Auth layout bottom inset
Layout conventions
Pattern	Spec
Page horizontal padding
16px (lists, settings) or 24px (forms, filters)
Header top inset
36px from safe area
Sticky header scrim
White at 95% opacity over scrolling content
Settings nav row
12px vertical padding, 23px icon, 8px icon-to-text
Section label to content
12px
Section to section
20px
Primary CTA container
Full width, 16px horizontal parent padding
Form bottom chrome
CTA area: 16px horizontal + 9px bottom
Admin layout recommendation
Zone	Width / padding
Sidebar
240px fixed, 16px inner padding
Main content
max-width 1200px, 24px padding
Data table cell padding
12px vertical, 16px horizontal
Card grid gap
16px
5. Missing Elements — Admin Extensions
These patterns do not exist in the mobile theme. Proposals below strictly extend existing tokens.

Sidebar navigation
State	Background	Text	Icon	Indicator
Default
transparent
#565656, Poppins Medium 15px
#565656
—
Hover
#F6F6F6
#000000
#000000
—
Active
#F6F6F6
#000000, Medium 15px
#000000
2px left bar #000000
Section label
—
#767676, Poppins Medium 11px, 1% tracking, uppercase optional
—
—
Sidebar bg: #FFFFFF
Border-right: 1px #EFEFEF
Logo: League Gothic 24px “DATER” + TM 8px, top padding 24px
No purple active states — black only
Top bar / page header
Height: 64px
Background: #FFFFFF with bottom border 1px #EFEFEF
Title: H1 or scrolled title (16px Medium) depending on scroll
Actions: text buttons in Poppins Medium 14px #000000; primary action = black pill button at reduced width (not full-bleed)
Data tables
Element	Style
Container
White, 10px radius, 0.7px #D1D1D1 border, no shadow
Header row
Background #F6F6F6, text Poppins Medium 12px #767676, 1% tracking, 12px / 16px padding
Body row
Poppins Regular 14px #000000, 12px / 16px padding
Row separator
1px #EFEFEF
Row hover
Background #FAFAFA (subtle — no color wash)
Row selected
Background #F6F6F6, left accent 2px #000000
Empty state
Poppins Regular 14px #565656, centered
Pagination
Element	Style
Container
Right-aligned, 8px gap between controls
Page button
32×32px, radius 6px, border 1px #D1D1D1, text 14px #000000
Active page
Fill #000000, text #FFFFFF
Disabled
Text #A9A9A9, border #EFEFEF
Prev/Next
Text-only Poppins Medium 14px #000000; disabled #A9A9A9
No filled purple pagination — keep monochrome.

Status badges (moderation)
Extend chip pattern:

Status	Background	Text	Border
Pending
#FFFFFF
#565656
1px #D1D1D1
Approved
#000000
#FFFFFF
none
Rejected
#FFFFFF
#FD1C1C
1px #FD1C1C
Premium
#FFFFFF
#5E17EB
1px #5E17EB
Font: Poppins Medium 12px, padding 8px × 4px, pill radius.

Search / filter bar
Single-line input: standard FormTextField spec, max-width 320px
Filter chips: reuse lifestyle chip pattern
“Advanced” link: Poppins Medium 14px #5E17EB (only purple text in admin chrome)
Toast / snackbar
Background: #000000
Text: #FFFFFF, Poppins Regular 13px
Radius: 10px
No colored success toasts — keep black; use #FD1C1C border-left 3px for errors if needed
Breadcrumbs
Poppins Regular 13px
Current: #000000
Ancestors: #767676, hover #000000
Separator: / in #A9A9A9
No blue link color unless navigating externally
Empty & loading states
Loading: three 6px dots, #000000 on white (matches AppLoadingDots)
Skeleton: #F6F6F6 on #FFFFFF, no shimmer gradient (app uses subtle feed shimmer — keep admin simpler)
Quick Reference — Admin CSS Variables
:root {
  /* Fonts */
  --font-wordmark: 'League Gothic', sans-serif;
  --font-ui: 'Poppins', sans-serif;
  /* Core */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-brand: #5E17EB;
  --color-error: #FD1C1C;
  /* Text */
  --text-primary: #000000;
  --text-secondary: #565656;
  --text-muted: #767676;
  --text-hint: #999999;
  --text-disabled: #A9A9A9;
  /* Surfaces */
  --surface-page: #FFFFFF;
  --surface-shell: #F2EFF3;
  --surface-input: #F6F6F6;
  --surface-hover: #FAFAFA;
  /* Borders */
  --border-card: #D1D1D1;
  --border-input: #484848;
  --border-subtle: #EFEFEF;
  /* Radii */
  --radius-button: 28px;
  --radius-input: 14px;
  --radius-card: 10px;
  --radius-chip: 100px;
  --radius-dialog: 12px;
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-base: 16px;
  --space-lg: 20px;
  --space-xl: 24px;
  --space-2xl: 36px;
}
Source files referenced
File	Contents
ui/theme/Color.kt
Material + app semantic colors
ui/theme/Type.kt
Font families, AppTypography, Material Typography
ui/theme/Theme.kt
Light-only DaterTheme
ui/LayoutConstants.kt
Spacing, header, CTA insets
ui/components/FormComponents.kt
Primary button, form fields, checkboxes
ui/components/FormLayout.kt
Form page structure
ui/components/DaterModalBottomSheet.kt
Sheet wrapper
ui/components/DeleteStoryConfirmDialog.kt
Dialog pattern
ui/components/SettingsStyleSwitch.kt
Toggle styling
ui/components/OverlayNarrowCtaButton.kt
Narrow CTA pills
ui/components/DaterWordmarkWithTm.kt
Logo lockup
screens/auth/AuthComponents.kt
Auth-specific buttons/fields
screens/profile/WriteCommentScreen.kt
Multiline comment input
screens/settings/SettingsScreen.kt
List rows, dividers, greys
screens/home/FilterBottomSheet.kt
Filter layout, purple accent
res/values/colors.xml
Brand purple XML tokens