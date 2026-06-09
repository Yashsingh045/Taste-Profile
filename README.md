# CalorAI — Taste Profile

## Project overview

CalorAI Taste Profile is a React Native (Expo) app that recreates the swipe-based
food-preference flow from the provided Figma. The user is introduced to the
flow on the Intro screen, swipes through 30 foods on the Swipe screen, and sees
a summary on the Results screen — backed by a glass-blur bottom nav, a Taste
Profile screen, and an FAQ tab that match the Figma's bottom navigation.

The three brief-required core screens are all implemented (Intro, Swipe,
Results). Swipe accepts both gesture and tap-button input, and the progress bar
updates as the deck is consumed. The Figma's bottom navigation, Taste Profile
screen, and FAQ tab are also implemented since the brief calls out the Figma
as the "visual source of truth."

Bonus features I added from the brief's nice-to-have list:
- **Undo last swipe** — small "Undo" pill next to the progress bar; rewinds one card and the matching swipe record.
- **Profile generation logic** — favourite cuisines and personality highlights ("Carnivore", "Italian Food", "Veg-Forward", etc.) are derived from the user's swipes via tag and category frequency.
- **Advanced animations** — card rotation tied to horizontal pan, spring snap-back, ease-in fly-off, and `expo-haptics` impact feedback on button taps.

## Setup / installation

Prerequisites: Node 20+, npm, and the **Expo Go** app on a real iOS / Android
device (or an iOS simulator / Android emulator).

```bash
npm install
npm start
```

Then either:

- scan the QR code with **Expo Go** on iOS / Android, or
- press `i` in the terminal to open the iOS simulator, or
- press `a` for the Android emulator.

Bundles cleanly for both iOS and Android on Expo SDK 54.

## Libraries used and why

| Library | Why |
| --- | --- |
| `expo` (SDK 54) + TypeScript | Managed workflow, runs in the Play Store / App Store build of Expo Go on both platforms. |
| `@react-navigation/native` + `native-stack` | Stack navigation between the tabbed home and the Swipe / Results flow. |
| `react-native-gesture-handler` | Pan gesture for the swipe card. |
| `react-native-reanimated` (v4) + `react-native-worklets` | 60fps card transforms, spring snap-back, ease-in fly-off animation. |
| `expo-blur` | iOS frosted-glass on cards and bottom nav (Android falls back gracefully — see below). |
| `expo-linear-gradient` | Top-to-bottom darken used in the screen backdrop. |
| `expo-haptics` | Light / heavy impact feedback when tapping the swipe action buttons; selection click on undo. |
| `@expo/vector-icons` | Home / FAQ / heart / star / close / search / carrot / undo icons. |
| `react-native-safe-area-context` | Safe-area-aware spacing for the floating bottom nav and screen headers. |

## Assumptions / trade-offs

- **Food card content.** The Figma swipe card uses an emoji + sentence ("I love
  eating salads") but `foods.json` ships Unsplash photos. I went with **photo +
  sentence** — the image gives every card a unique identity and the sentence
  pattern matches Figma.
- **Four action buttons.** Figma shows Swipe Left / Not Sure / Super Like /
  Swipe Right. All four are wired: Not Sure records a `skip` (excluded from
  results), Super Like double-counts in cuisine derivation.
- **Cuisines.** I used the **5 cuisines from `foods.json`** (Italian, Mexican,
  Japanese, Mediterranean, American). Figma previewed Indian / Lebanese which
  aren't in the provided data, so I honoured the data over the design here.
- **Result tabs.** Brief asks for "simple counts/breakdown"; Figma shows a
  paged carousel. I shipped a 4-tab carousel — *Foods You Hate*, *Foods You
  Love*, *Your Favorite Cuisines*, *Categories You Crave* (count + percent
  breakdown by food category) — driven entirely by swipe data.
- **FAQ tab.** Figma shows the icon in the bottom nav but doesn't spec the
  screen. I shipped a static collapsible FAQ (5 items) styled like the rest of
  the app.
- **Search icon.** Present visually as designed in Figma; tapping it currently
  no-ops.

## How I handled platform differences between iOS and Android

Native blur is the cross-platform pain point the brief calls out. In
`src/components/GlassCard.tsx`:

- **iOS** — `expo-blur`'s `BlurView` at intensity 28 (in the brief's 20–30
  range), with a `rgba(255, 255, 255, 0.10)` overlay layer for tint (matching
  the brief's code sample), a 1px `rgba(255, 255, 255, 0.20)` border, and a
  drop shadow cast from an outer wrapper so it actually renders.
- **Android** — solid `rgba(20, 20, 20, 0.80)` fallback, with the **same**
  border, the **same** drop shadow, and the **same** rounded shape. The visual
  hierarchy of the glass surface is carried by the border + tint + shadow, with
  blur being a *bonus* on iOS. UI never looks broken or empty.

Other platform-aware bits:

- `expo-haptics` calls are guarded by `Platform.OS !== 'web'` so they no-op in
  the web preview.
- The FAQ accordion opts into
  `UIManager.setLayoutAnimationEnabledExperimental(true)` on Android so the
  expand/collapse animates.
- Android's predictive-back gesture is disabled in `app.json` because the
  swipe flow uses horizontal pan gestures that would conflict with it.
- `react-native-worklets/plugin` is registered in `babel.config.js` so
  Reanimated v4 worklets work on both platforms with the new architecture.

## Time breakdown

Total: ~7 hours active build time within the 8-hour cap.

| Block | Time |
| --- | --- |
| Reading brief + Figma, clarifying scope, planning | 0:40 |
| Expo scaffold, dependency install, theme tokens | 0:35 |
| Food data + types + taste-profile context (+ derivation) | 0:35 |
| Glass card, gradient bg, screen shell, bottom nav, back btn | 0:55 |
| Intro screen | 0:25 |
| Swipe card (gestures, spring, fly-off), action buttons | 1:00 |
| Swipe screen wiring + progress bar + haptics + undo | 0:40 |
| Results screen + 4-tab carousel + category breakdown | 0:50 |
| Taste Profile screen (highlights / lifestyle / loves) | 0:35 |
| FAQ screen | 0:15 |
| Navigation wiring + UI context | 0:25 |
| Figma-fidelity pass (glass spec, button hold smoothness, sizes) | 0:50 |
| TypeScript fixes, Metro bundle verification (iOS + Android) | 0:20 |
| README | 0:15 |

## Notes on AI tool usage

I used **Claude Code (Anthropic)** as my pair programmer throughout this build.
Concretely:

- **Spec ingestion.** Pasted the ClickUp PDF and Figma screenshots in; Claude
  surfaced the doc-vs-Figma discrepancies (2 buttons vs 4, food-name vs "I love
  eating X", missing Taste Profile screen) before I started coding.
- **Scaffold + types.** Generated the Expo TS scaffold, the strongly-typed
  `Food / Cuisine / SwipeAction / TasteProfile` model, and the 30-food data
  module verbatim from the brief's appendix.
- **Reanimated gesture logic.** Drafted the pan handler, the spring snap-back
  thresholds, the ease-in fly-off animation, and the imperative `swipe()` ref
  API the tap-buttons use.
- **Android glass fallback.** Suggested the platform-branched `GlassCard`
  implementation and the supporting tint layer for iOS contrast.
- **Cuisine + highlight + category derivation.** Tag/category frequency logic
  and the category → highlight mapping were AI-drafted, then I trimmed them.
- **Manual.** Visual polish vs the Figma references, final spacing pass,
  README structure, and all commits / human review pass.

I treated AI as a partner and reviewed every diff before commit. Every file in
this repo was something I read end-to-end at least once.
