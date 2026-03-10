# Appspirin

## Project Overview
Appspirin is a native mobile app that digitizes paper safety plans
(Stanley-Brown format) and turns them into an interactive tool with
personalized check-ins, escalation-based recommendations, and
one-tap access to crisis resources and personal contacts.

Privacy is a core architectural constraint: all data is local-only,
no accounts, no analytics, no cloud sync. This is non-negotiable.

## Tech Stack
- React Native with Expo (bare workflow)
- TypeScript (strict mode)
- Navigation: React Navigation v7 (native stack + drawer)
- Database: WatermelonDB with SQLCipher encryption
- Encryption keys: react-native-keychain
- OCR: ML Kit (Android), Vision framework (iOS)
- Notifications: expo-notifications
- Styling: StyleSheet.create() — no inline styles

## Navigation Architecture
- **Plan hub is home.** The safety plan view is the center of gravity.
  Check-in initiation, contact calling, and plan editing all happen
  from or return to this screen.
- **Left drawer** for secondary navigation: Check-In History, Crisis
  Line Settings, App Appearance, About/Privacy. Accessible via
  hamburger icon or left-edge swipe.
- **Onboarding** is a separate stack. The drawer is hidden during
  onboarding. Two paths: "Quick setup" and "Walk me through it."
- **Persistent floating "Need help now?" button** rendered outside the
  navigation hierarchy so it appears on every screen including
  onboarding. Surfaces the user's configured crisis lines.
- **No bottom tabs.** Keep navigation shallow — most actions are 1-2
  taps from the plan hub.

## Design & Component Ownership
- The designer (who is also the product owner) owns:
  - All Figma designs
  - The React Native component library (src/components/)
  - Design tokens (src/theme/tokens.ts)
  - Theme variants and visual QA
- Claude Code owns:
  - Screen composition using the component library
  - Navigation, data layer, business logic, services
  - Wiring theme provider, database, notifications
- **Claude Code must NEVER create new base UI components.** All screens
  are composed from components in src/components/. If a screen needs
  a component that doesn't exist, flag it — do not improvise a new one.
- The designer builds components using StyleSheet.create() with simple,
  well-documented TypeScript prop interfaces.
- Components are imported from src/components/index.ts (barrel export).

## Data Models
- SafetyPlan: root container, one per user
- WarningSign: user's warning signs (text, display_order, active)
- CopingStrategy: coping strategies (text, display_order, section)
- Contact: people on the plan (name, phone, relationship, contact_type)
  — contact_type is one of: distraction, personal, professional
- CrisisResource: configurable crisis lines (name, phone, text_number,
  is_selected, display_order) — pre-seeded with 988, Crisis Text Line,
  Veterans Crisis Line, Trevor Project, Trans Lifeline, SAMHSA
- CheckIn: check-in records (timestamp, severity_score, notes)
- CheckInResponse: per-warning-sign responses within a check-in
  (check_in_id, warning_sign_id, endorsed boolean)
- TextTemplate: pre-written outreach messages (text, is_default,
  display_order)
- UserSettings: singleton for preferences (theme, check-in frequency,
  check-in times, nudge threshold, onboarding status)

## Key Constraints
- ZERO network calls. All data stays on device. No sync, no analytics,
  no crash reporting that phones home.
- No user accounts. No login, no email collection. The database IS
  the user's data.
- True deletion. When a user deletes data, it's gone. No soft
  deletes, no tombstones.
- Accessibility is mandatory. Test with VoiceOver (iOS) and TalkBack
  (Android). WCAG AA contrast ratios, screen reader labels, minimum
  44x44pt touch targets.
- The persistent "Need help now?" crisis button must be visible on
  every screen. It surfaces the user's configured crisis lines.
  Defaults to 988 until configured.
- Crisis lines are user-configurable, not hardcoded. The app ships
  with a curated pre-populated list but the user chooses which to
  keep, can add custom lines, and can reorder them.

## Code Standards
- Functional components only, no class components
- All components must have TypeScript interfaces for props
- Error boundaries around each major screen
- No console.log in committed code — use a logger utility
- Test files colocated: Component.tsx / Component.test.tsx

## Stanley-Brown Safety Plan Structure
The app maps to six escalation steps:
1. Warning signs (internal)
2. Internal coping strategies
3. People and social settings for distraction
4. People to contact for help
5. Professionals and agencies to contact
6. Making the environment safe

Check-in severity maps to these steps: low → steps 1-3,
medium → steps 4-5, high → step 6 + crisis resources.

## UX Principles
- The plan hub is home. Everything radiates from it.
- Onboarding has two paths: "Quick setup" (60-90 sec) and
  "Walk me through it" (3-5 min). Both land on the plan hub.
- Partial plans are allowed. Gentle badge nudge, not blocking.
- Check-ins should take under 60 seconds.
- The app should feel warm but discreet. Default appearance should
  not be identifiable as a mental health app.
- No confirmation gates before crisis actions (calling, texting).
- The drawer contains settings and history — things you need
  occasionally, not every session.

